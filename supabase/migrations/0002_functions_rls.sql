-- Helpers (security definer in private schema, fixed search_path)
create or replace function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from private.admin_users a where a.user_id = (select auth.uid()));
$$;
create or replace function private.is_family_member(fid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.family_members m where m.family_id = fid and m.user_id = (select auth.uid()));
$$;
create or replace function private.is_family_owner(fid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.families f where f.id = fid and f.owner_id = (select auth.uid()));
$$;
create or replace function private.shares_family(other uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.family_members a join public.family_members b on a.family_id = b.family_id
                 where a.user_id = (select auth.uid()) and b.user_id = other);
$$;
create or replace function private.is_friend(other uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.friendships f where f.status = 'accepted'
     and ((f.requester_id = (select auth.uid()) and f.addressee_id = other)
       or (f.addressee_id = (select auth.uid()) and f.requester_id = other)));
$$;
create or replace function private.can_see(owner uuid, aud public.audience) returns boolean
language sql stable security definer set search_path = '' as $$
  select owner = (select auth.uid())
      or (aud = 'family' and private.shares_family(owner))
      or (aud = 'friends' and (private.shares_family(owner) or private.is_friend(owner)));
$$;
create or replace function private.is_parent_of(child uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = child and p.parent_id = (select auth.uid()));
$$;
create or replace function private.current_tier() returns public.tier
language sql stable security definer set search_path = '' as $$
  select coalesce((select e.tier from public.entitlements e where e.user_id = (select auth.uid())
                   and (e.expires_at is null or e.expires_at > now())), 'free'::public.tier);
$$;
create or replace function private.tier_rank(t public.tier) returns int
language sql immutable set search_path = '' as $$
  select case t when 'free' then 0 when 'plus' then 1 else 2 end;
$$;
create or replace function private.flag_on(k text) returns boolean
language sql stable security definer set search_path = '' as $$
  select k is null or coalesce((select f.enabled from public.feature_flags f where f.key = k), false);
$$;
grant usage on schema private to authenticated, anon;
grant execute on all functions in schema private to authenticated, anon;

-- New user bootstrap
create or replace function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id,
          left(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), 60),
          new.raw_user_meta_data->>'avatar_url');
  insert into public.privacy_settings (user_id) values (new.id);
  insert into public.user_progress (user_id) values (new.id);
  insert into public.entitlements (user_id) values (new.id);
  insert into public.bedtime_settings (user_id) values (new.id);
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function private.handle_new_user();

create or replace function private.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
create trigger profiles_touch before update on public.profiles for each row execute function private.touch_updated_at();
create trigger highlights_touch before update on public.highlights_notes for each row execute function private.touch_updated_at();

-- Protect privileged profile columns from client edits
create or replace function private.guard_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is not null and not private.is_admin() then
    new.id := old.id; new.is_child := old.is_child; new.parent_id := old.parent_id;
    new.friend_code := old.friend_code; new.created_at := old.created_at;
  end if;
  return new;
end; $$;
create trigger profiles_guard before update on public.profiles for each row execute function private.guard_profile();

-- Family owner automatically joins as owner
create or replace function private.family_owner_join() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.family_members (family_id, user_id, role) values (new.id, new.owner_id, 'owner');
  return new;
end; $$;
create trigger families_owner_join after insert on public.families for each row execute function private.family_owner_join();

-- ========== RLS ==========
do $$ declare t text; begin
  foreach t in array array['profiles','privacy_settings','bible_versions','books','chapters','verses','stories','scenes',
    'voices','media_assets','audio_timings','content_reviews','feature_flags','bookmarks','highlights_notes',
    'reading_sessions','user_progress','journey_levels','bedtime_settings','friendships','families','family_members',
    'encouragements','reading_plans','plan_items','plan_enrollments','plan_progress','subscriptions','entitlements','downloads']
  loop execute format('alter table public.%I enable row level security', t); end loop;
end $$;
alter table private.billing_events enable row level security;
alter table private.admin_users enable row level security;
revoke all on private.billing_events, private.admin_users from anon, authenticated;

-- Public reference content
create policy "read versions" on public.bible_versions for select using (is_active);
create policy "read books" on public.books for select using (true);
create policy "read chapters" on public.chapters for select using (true);
create policy "read verses" on public.verses for select using (true);
create policy "read journey levels" on public.journey_levels for select using (true);
create policy "read flags" on public.feature_flags for select using (true);
create policy "read voices" on public.voices for select using (is_active);
create policy "read published stories" on public.stories for select using (review_status = 'published' or private.is_admin());
create policy "read published scenes" on public.scenes for select using (review_status = 'published' or private.is_admin());
create policy "read entitled media" on public.media_assets for select using (
  private.is_admin() or (review_status = 'published' and private.flag_on(feature_flag)
    and private.tier_rank(private.current_tier()) >= private.tier_rank(tier_required)));
create policy "read timings" on public.audio_timings for select using (true);
-- Admin write on content
create policy "admin stories" on public.stories for all using (private.is_admin()) with check (private.is_admin());
create policy "admin scenes" on public.scenes for all using (private.is_admin()) with check (private.is_admin());
create policy "admin media" on public.media_assets for all using (private.is_admin()) with check (private.is_admin());
create policy "admin reviews" on public.content_reviews for all using (private.is_admin()) with check (private.is_admin());
create policy "admin flags" on public.feature_flags for update using (private.is_admin()) with check (private.is_admin());

-- Profiles
create policy "profile self/family/friends read" on public.profiles for select to authenticated using (
  id = (select auth.uid()) or private.is_parent_of(id) or private.shares_family(id) or private.is_friend(id));
create policy "profile self update" on public.profiles for update to authenticated
  using (id = (select auth.uid()) or private.is_parent_of(id)) with check (id = (select auth.uid()) or private.is_parent_of(id));
create policy "privacy self" on public.privacy_settings for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Personal data
create policy "bookmarks own" on public.bookmarks for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "highlights own" on public.highlights_notes for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "highlights shared read" on public.highlights_notes for select to authenticated using (
  (visibility = 'family' and private.shares_family(user_id)) or
  (visibility = 'friends' and (private.shares_family(user_id) or private.is_friend(user_id))));
create policy "sessions own read" on public.reading_sessions for select to authenticated using (user_id = (select auth.uid()) or private.is_parent_of(user_id));
create policy "sessions own insert" on public.reading_sessions for insert to authenticated with check (user_id = (select auth.uid()));
create policy "sessions own update" on public.reading_sessions for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "progress read" on public.user_progress for select to authenticated using (
  user_id = (select auth.uid()) or private.is_parent_of(user_id)
  or private.can_see(user_id, (select p.show_streak_to from public.privacy_settings p where p.user_id = user_progress.user_id)));
create policy "bedtime own" on public.bedtime_settings for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "downloads own" on public.downloads for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "entitlement own read" on public.entitlements for select to authenticated using (user_id = (select auth.uid()));
create policy "subscription own read" on public.subscriptions for select to authenticated using (user_id = (select auth.uid()));

-- Friendships (children cannot send requests)
create policy "friendship parties read" on public.friendships for select to authenticated
  using ((select auth.uid()) in (requester_id, addressee_id));
create policy "friendship request" on public.friendships for insert to authenticated with check (
  requester_id = (select auth.uid()) and status = 'pending'
  and not exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_child)
  and not exists (select 1 from public.profiles p where p.id = addressee_id and p.is_child));
create policy "friendship respond" on public.friendships for update to authenticated
  using (addressee_id = (select auth.uid()) or requester_id = (select auth.uid()))
  with check (addressee_id = (select auth.uid()) or (requester_id = (select auth.uid()) and status = 'blocked'));
create policy "friendship remove" on public.friendships for delete to authenticated
  using ((select auth.uid()) in (requester_id, addressee_id));

-- Families
create policy "family read" on public.families for select to authenticated using (private.is_family_member(id) or owner_id = (select auth.uid()));
create policy "family create" on public.families for insert to authenticated with check (
  owner_id = (select auth.uid()) and not exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_child));
create policy "family owner update" on public.families for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "family owner delete" on public.families for delete to authenticated using (owner_id = (select auth.uid()));
create policy "members read" on public.family_members for select to authenticated using (private.is_family_member(family_id));
create policy "members owner manage" on public.family_members for all to authenticated
  using (private.is_family_owner(family_id)) with check (private.is_family_owner(family_id));
create policy "members leave" on public.family_members for delete to authenticated using (user_id = (select auth.uid()) and role <> 'owner');

-- Encouragements: preset only, between family/friends
create policy "encouragement send" on public.encouragements for insert to authenticated with check (
  sender_id = (select auth.uid()) and (private.shares_family(recipient_id) or private.is_friend(recipient_id)));
create policy "encouragement read" on public.encouragements for select to authenticated
  using ((select auth.uid()) in (sender_id, recipient_id));

-- Reading plans
create policy "plans read" on public.reading_plans for select using (
  is_template or owner_id = (select auth.uid()) or (family_id is not null and private.is_family_member(family_id)));
create policy "plans write own" on public.reading_plans for insert to authenticated with check (
  owner_id = (select auth.uid()) and not is_template and (family_id is null or private.is_family_member(family_id)));
create policy "plans update own" on public.reading_plans for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()) and not is_template);
create policy "plans delete own" on public.reading_plans for delete to authenticated using (owner_id = (select auth.uid()));
create policy "plan items read" on public.plan_items for select using (exists (select 1 from public.reading_plans r where r.id = plan_id));
create policy "plan items write" on public.plan_items for all to authenticated
  using (exists (select 1 from public.reading_plans r where r.id = plan_id and r.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.reading_plans r where r.id = plan_id and r.owner_id = (select auth.uid())));
create policy "enroll own" on public.plan_enrollments for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "progress plan own" on public.plan_progress for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "progress plan family read" on public.plan_progress for select to authenticated using (
  exists (select 1 from public.reading_plans r where r.id = plan_id and r.family_id is not null and private.is_family_member(r.family_id)));

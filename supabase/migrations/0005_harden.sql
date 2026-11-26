-- Extra constraints, indexes and safer inputs. Existing rows are not scanned
-- for the new checks (NOT VALID) so a live database is not blocked.

alter table public.bedtime_settings add column if not exists updated_at timestamptz not null default now();
alter table public.families add column if not exists updated_at timestamptz not null default now();

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'bedtime_settings_touch') then
    create trigger bedtime_settings_touch before update on public.bedtime_settings
      for each row execute function private.touch_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'families_touch') then
    create trigger families_touch before update on public.families
      for each row execute function private.touch_updated_at();
  end if;
end $$;

create index if not exists friendships_requester_idx on public.friendships (requester_id);
create index if not exists friendships_addressee_idx on public.friendships (addressee_id);
create index if not exists encouragements_recipient_idx on public.encouragements (recipient_id, created_at desc);
create index if not exists family_members_user_idx on public.family_members (user_id);
create index if not exists highlights_user_verse_idx on public.highlights_notes (user_id, verse_id);
create index if not exists bookmarks_user_verse_idx on public.bookmarks (user_id, verse_id);
create index if not exists plan_progress_user_idx on public.plan_progress (user_id);
create index if not exists reading_sessions_user_started_idx on public.reading_sessions (user_id, started_at desc);

alter table public.audio_timings drop constraint if exists audio_timings_range;
alter table public.audio_timings add constraint audio_timings_range check (end_ms >= start_ms and start_ms >= 0) not valid;
alter table public.highlights_notes drop constraint if exists highlights_color;
alter table public.highlights_notes add constraint highlights_color check (color is null or color in ('yellow','green','blue','pink')) not valid;
alter table public.subscriptions drop constraint if exists subscriptions_status;
alter table public.subscriptions add constraint subscriptions_status check (status in ('trialing','active','past_due','canceled','incomplete','incomplete_expired')) not valid;

create or replace function public.request_friend(code text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); target uuid; fid uuid; normalised text := upper(coalesce(code, ''));
begin
  if me is null then raise exception 'not signed in'; end if;
  if normalised !~ '^[A-F0-9]{8}$' then raise exception 'code not found'; end if;
  if exists (select 1 from public.profiles where id = me and is_child) then raise exception 'child accounts cannot add friends'; end if;
  select p.id into target from public.profiles p join public.privacy_settings s on s.user_id = p.id
    where p.friend_code = normalised and s.discoverable_by_code and not p.is_child;
  if target is null or target = me then raise exception 'code not found'; end if;
  insert into public.friendships (requester_id, addressee_id) values (me, target) returning id into fid;
  return fid;
end; $$;

create or replace function public.join_family(code text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); fid uuid; normalised text := upper(coalesce(code, ''));
begin
  if me is null then raise exception 'not signed in'; end if;
  if normalised !~ '^[A-F0-9]{8}$' then raise exception 'code not found'; end if;
  select id into fid from public.families where invite_code = normalised;
  if fid is null then raise exception 'code not found'; end if;
  if (select count(*) from public.family_members where family_id = fid) >= 6 then raise exception 'family is full'; end if;
  insert into public.family_members (family_id, user_id, role) values (fid, me, 'member') on conflict do nothing;
  return fid;
end; $$;

create or replace function public.recompute_my_progress(tz text default 'UTC') returns public.user_progress
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); r public.user_progress; pts int := 0; streak int := 0; longest int := 0;
  d date; prev date; grace int; today date; lvl smallint; zone text := coalesce(tz, 'UTC');
begin
  if uid is null then raise exception 'not signed in'; end if;
  if char_length(zone) > 64 or zone !~ '^[A-Za-z0-9_+/-]+$' then zone := 'UTC'; end if;
  begin
    today := (now() at time zone zone)::date;
  exception when invalid_parameter_value then
    zone := 'UTC';
    today := (now() at time zone 'UTC')::date;
  end;
  select coalesce(sum(least(30, s.secs / 60) + 10), 0) into pts
    from (select local_date, sum(seconds_active) secs from public.reading_sessions where user_id = uid group by local_date
          having sum(seconds_active) >= 60) s;
  pts := pts + 5 * (select count(*) from public.plan_progress where user_id = uid);
  grace := 2; prev := null;
  for d in select local_date from public.reading_sessions where user_id = uid
           group by local_date having sum(seconds_active) >= 300 or bool_or(completed) order by local_date desc loop
    if prev is null then
      if today - d > 1 + grace then exit; end if;
      streak := 1;
    elsif prev - d = 1 then streak := streak + 1;
    elsif prev - d - 1 <= grace then grace := grace - (prev - d - 1); streak := streak + 1;
    else exit; end if;
    prev := d;
  end loop;
  pts := pts + 2 * (streak / 7) * 7;
  select coalesce(max(level),1) into lvl from public.journey_levels where min_points <= pts;
  select greatest(coalesce(longest_streak,0), streak), greatest(coalesce(journey_level,1), lvl)
    into longest, lvl from public.user_progress where user_id = uid;
  update public.user_progress set
    current_streak = streak, longest_streak = longest, grace_days_left = grace,
    journey_points = greatest(journey_points, pts), journey_level = lvl,
    total_seconds = (select coalesce(sum(seconds_active),0) from public.reading_sessions where user_id = uid),
    chapters_completed = (select count(distinct chapter_id) from public.reading_sessions where user_id = uid and completed and chapter_id is not null),
    stories_completed = (select count(distinct story_id) from public.reading_sessions where user_id = uid and completed and story_id is not null),
    last_read_date = (select max(local_date) from public.reading_sessions where user_id = uid),
    updated_at = now()
  where user_id = uid returning * into r;
  return r;
end; $$;

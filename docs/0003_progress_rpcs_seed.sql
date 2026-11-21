-- Faith Journey: recompute progress for the calling user (consistency only, capped daily, never decreases level)
create or replace function public.recompute_my_progress(tz text default 'UTC') returns public.user_progress
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); r public.user_progress; pts int := 0; streak int := 0; longest int := 0;
  d date; prev date; grace int; today date := (now() at time zone tz)::date; lvl smallint;
begin
  if uid is null then raise exception 'not signed in'; end if;
  -- points: per day min(30, minutes) + 10 for reading that day + 5 per plan day done
  select coalesce(sum(least(30, s.secs / 60) + 10), 0) into pts
    from (select local_date, sum(seconds_active) secs from public.reading_sessions where user_id = uid group by local_date
          having sum(seconds_active) >= 60) s;
  pts := pts + 5 * (select count(*) from public.plan_progress where user_id = uid);
  -- streak: days with >= 5 minutes or a completed item; 2 grace days per calendar month
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
revoke all on function public.recompute_my_progress(text) from public, anon;
grant execute on function public.recompute_my_progress(text) to authenticated;

-- Send a friend request by friend code
create or replace function public.request_friend(code text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); target uuid; fid uuid;
begin
  if me is null then raise exception 'not signed in'; end if;
  if exists (select 1 from public.profiles where id = me and is_child) then raise exception 'child accounts cannot add friends'; end if;
  select p.id into target from public.profiles p join public.privacy_settings s on s.user_id = p.id
    where p.friend_code = upper(code) and s.discoverable_by_code and not p.is_child;
  if target is null or target = me then raise exception 'code not found'; end if;
  insert into public.friendships (requester_id, addressee_id) values (me, target) returning id into fid;
  return fid;
end; $$;
revoke all on function public.request_friend(text) from public, anon;
grant execute on function public.request_friend(text) to authenticated;

-- Join a family by invite code (adults only; children are added by the owner)
create or replace function public.join_family(code text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); fid uuid;
begin
  if me is null then raise exception 'not signed in'; end if;
  select id into fid from public.families where invite_code = upper(code);
  if fid is null then raise exception 'code not found'; end if;
  if (select count(*) from public.family_members where family_id = fid) >= 6 then raise exception 'family is full'; end if;
  insert into public.family_members (family_id, user_id, role) values (fid, me, 'member') on conflict do nothing;
  return fid;
end; $$;
revoke all on function public.join_family(text) from public, anon;
grant execute on function public.join_family(text) to authenticated;

-- Seed reference data
insert into public.bible_versions (code, name, license, source_url) values
 ('WEB','World English Bible','Public domain','https://ebible.org/find/details.php?id=engwebp'),
 ('BSB','Berean Standard Bible','Public domain (dedicated 2023)','https://berean.bible/downloads.htm'),
 ('KJV','King James Version','Public domain (Crown patent applies in the UK)','https://ebible.org/find/details.php?id=eng-kjv');
insert into public.journey_levels values
 (1,'Seed',0,'Just started'),(2,'Sprout',150,'Reading has begun to take root'),(3,'Rooted',500,'A regular reading habit'),
 (4,'Growing Branch',1200,'Steady over months'),(5,'Fruitful',2500,'A long, consistent journey'),
 (6,'Lamp to My Feet',5000,'From Psalm 119:105');
insert into public.feature_flags values
 ('video_mode',false,'Premium video story mode (human/anime)'),
 ('premium_voices',false,'Cloud TTS / human narration voices'),
 ('billing',false,'Real purchases via RevenueCat/Stripe'),
 ('offline_media',false,'Download images/audio/video for offline'),
 ('scene_images',true,'Illustrated story scenes (placeholders until reviewed art)');
insert into public.voices (id,name,provider,style,is_bedtime,tier_required,feature_flag) values
 ('device-default','Device voice','device','narrator',false,'free',null),
 ('device-calm','Device voice (slow, calm)','device','calm',true,'free',null),
 ('premium-narrator','Premium narrator','elevenlabs','narrator',false,'plus','premium_voices'),
 ('premium-bedtime','Premium bedtime voice','elevenlabs','calm',true,'plus','premium_voices');

-- Storage buckets: public placeholders + private paid media (signed URLs via Edge Function)
insert into storage.buckets (id, name, public) values ('media-public','media-public',true), ('media-private','media-private',false), ('avatars','avatars',true)
  on conflict (id) do nothing;
create policy "avatar upload own" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatar update own" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatar delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Wellness features. Every table is owner-only: a signed-in person can read
-- and write their own rows, and nobody else's. There is no public read and
-- no service-role policy in this migration.

create table public.user_topics (
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic text not null check (topic in (
    'anxiety','forgiveness','grief','purpose','gratitude','rest','courage','peace'
  )),
  created_at timestamptz not null default now(),
  primary key (user_id, topic)
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index journal_entries_owner_idx on public.journal_entries (user_id, created_at desc);

create table public.gratitude_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  local_date date not null,
  created_at timestamptz not null default now(),
  unique (user_id, local_date)
);
create index gratitude_entries_owner_idx on public.gratitude_entries (user_id, local_date desc);

create table public.prayer_reminders (
  user_id uuid not null references public.profiles(id) on delete cascade,
  slot text not null check (slot in ('morning','evening','meals','situations')),
  enabled boolean not null default false,
  remind_time time not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, slot)
);

create table public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  programme_id text not null check (char_length(programme_id) between 1 and 40),
  lesson_id text not null check (char_length(lesson_id) between 1 and 40),
  completed boolean not null default false,
  quiz_score smallint check (quiz_score between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, programme_id, lesson_id)
);

create table public.mood_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mood text not null check (mood in ('calm','grateful','anxious','sad','angry','tired','hopeful')),
  note text check (note is null or char_length(note) <= 1000),
  local_date date not null,
  created_at timestamptz not null default now()
);
create index mood_checkins_owner_idx on public.mood_checkins (user_id, local_date desc);

create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null check (plan in ('premium-monthly','premium-annual','family')),
  created_at timestamptz not null default now(),
  unique (user_id, plan)
);

create table public.companion_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user','companion')),
  body text not null check (char_length(body) between 1 and 4000),
  citations jsonb not null default '[]'::jsonb check (jsonb_typeof(citations) = 'array'),
  created_at timestamptz not null default now()
);
create index companion_messages_owner_idx on public.companion_messages (user_id, created_at);

create trigger journal_entries_touch before update on public.journal_entries
  for each row execute function private.touch_updated_at();
create trigger prayer_reminders_touch before update on public.prayer_reminders
  for each row execute function private.touch_updated_at();
create trigger lesson_progress_touch before update on public.lesson_progress
  for each row execute function private.touch_updated_at();

alter table public.user_topics enable row level security;
alter table public.journal_entries enable row level security;
alter table public.gratitude_entries enable row level security;
alter table public.prayer_reminders enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.mood_checkins enable row level security;
alter table public.waitlist_signups enable row level security;
alter table public.companion_messages enable row level security;

create policy "topics own" on public.user_topics for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "journal own" on public.journal_entries for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "gratitude own" on public.gratitude_entries for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "reminders own" on public.prayer_reminders for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "lessons own" on public.lesson_progress for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "moods own" on public.mood_checkins for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "waitlist own" on public.waitlist_signups for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "companion own" on public.companion_messages for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

revoke all on table public.user_topics from anon;
revoke all on table public.journal_entries from anon;
revoke all on table public.gratitude_entries from anon;
revoke all on table public.prayer_reminders from anon;
revoke all on table public.lesson_progress from anon;
revoke all on table public.mood_checkins from anon;
revoke all on table public.waitlist_signups from anon;
revoke all on table public.companion_messages from anon;

grant select, insert, update, delete on table public.user_topics to authenticated;
grant select, insert, update, delete on table public.journal_entries to authenticated;
grant select, insert, update, delete on table public.gratitude_entries to authenticated;
grant select, insert, update, delete on table public.prayer_reminders to authenticated;
grant select, insert, update, delete on table public.lesson_progress to authenticated;
grant select, insert, update, delete on table public.mood_checkins to authenticated;
grant select, insert, update, delete on table public.waitlist_signups to authenticated;
grant select, insert, update, delete on table public.companion_messages to authenticated;

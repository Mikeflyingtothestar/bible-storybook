-- Public pricing waitlist (insert only) and a signed-in companion quota.

create table public.plan_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null check (
    char_length(email) between 6 and 120
    and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  ),
  plan text not null check (plan in ('premium-monthly', 'premium-annual', 'family')),
  created_at timestamptz not null default now()
);
create unique index plan_waitlist_email_plan_idx on public.plan_waitlist (lower(email), plan);
create index plan_waitlist_created_idx on public.plan_waitlist (created_at desc);

alter table public.plan_waitlist enable row level security;
create policy "plan waitlist insert" on public.plan_waitlist
  for insert to anon, authenticated
  with check (
    char_length(email) between 6 and 120
    and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and plan in ('premium-monthly', 'premium-annual', 'family')
  );
revoke all on table public.plan_waitlist from anon, authenticated;
grant insert on table public.plan_waitlist to anon, authenticated;

create table public.companion_quota (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day date not null,
  asks smallint not null default 0 check (asks between 0 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);
create index companion_quota_created_idx on public.companion_quota (created_at desc);

alter table public.companion_quota enable row level security;
create policy "companion quota own read" on public.companion_quota
  for select to authenticated
  using (user_id = (select auth.uid()));
revoke all on table public.companion_quota from anon, authenticated;
grant select on table public.companion_quota to authenticated;

create trigger companion_quota_touch before update on public.companion_quota
  for each row execute function private.touch_updated_at();

-- One row per person per UTC day. Returns how many questions remain after this ask.
-- Returns 0 when the day is already full. Guests are not counted here.
create or replace function public.use_companion_question() returns int
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := (select auth.uid());
  today date := (timezone('utc', now()))::date;
  used int;
begin
  if uid is null then raise exception 'not signed in'; end if;
  insert into public.companion_quota as q (user_id, day, asks)
  values (uid, today, 1)
  on conflict (user_id, day) do update
    set asks = q.asks + 1, updated_at = now()
    where q.asks < 5
  returning asks into used;
  if used is null then return 0; end if;
  return 5 - used;
end; $$;
revoke all on function public.use_companion_question() from public, anon;
grant execute on function public.use_companion_question() to authenticated;

alter table public.prayer_reminders add column if not exists created_at timestamptz not null default now();
alter table public.lesson_progress add column if not exists created_at timestamptz not null default now();
create index if not exists user_topics_created_idx on public.user_topics (user_id, created_at desc);
create index if not exists prayer_reminders_created_idx on public.prayer_reminders (user_id, created_at desc);
create index if not exists lesson_progress_created_idx on public.lesson_progress (user_id, created_at desc);
create index if not exists waitlist_signups_created_idx on public.waitlist_signups (user_id, created_at desc);

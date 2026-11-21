-- Bible Storybook: core schema (all features; paid media behind flags)
create extension if not exists pgcrypto;
create schema if not exists private;

-- ========== Enums ==========
create type public.theme_pref as enum ('system','light','dark','sepia');
create type public.tier as enum ('free','plus','premium');
create type public.reading_mode as enum ('text','audio','video','bedtime');
create type public.media_kind as enum ('image','audio','video');
create type public.media_style as enum ('none','human','anime');
create type public.review_status as enum ('draft','art_ok','theology_ok','published','rejected');
create type public.friend_status as enum ('pending','accepted','blocked');
create type public.family_role as enum ('owner','parent','child','member');
create type public.visibility as enum ('private','family','friends');
create type public.audience as enum ('nobody','family','friends');

-- ========== Profiles ==========
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 60),
  avatar_url text,
  birth_year int check (birth_year between 1900 and 2100),
  is_child boolean not null default false,
  parent_id uuid references public.profiles(id) on delete cascade,
  theme public.theme_pref not null default 'system',
  text_scale numeric(3,2) not null default 1.00 check (text_scale between 0.75 and 2.0),
  default_version_code text not null default 'WEB',
  locale text not null default 'en',
  friend_code text unique not null default upper(substr(encode(gen_random_bytes(6),'hex'),1,8)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.privacy_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  show_streak_to public.audience not null default 'nobody',
  show_level_to public.audience not null default 'nobody',
  show_activity_to public.audience not null default 'nobody',
  discoverable_by_code boolean not null default true
);

-- ========== Bible text ==========
create table public.bible_versions (
  id smallserial primary key,
  code text unique not null,            -- WEB, BSB, KJV
  name text not null,
  language text not null default 'en',
  license text not null,
  source_url text,
  is_public_domain boolean not null default true,
  is_active boolean not null default true
);
create table public.books (
  id serial primary key,
  version_id smallint not null references public.bible_versions(id) on delete cascade,
  osis_code text not null,              -- GEN, EXO ... REV
  name text not null,
  testament text not null check (testament in ('OT','NT')),
  order_index smallint not null,
  chapter_count smallint not null default 0,
  unique (version_id, osis_code)
);
create table public.chapters (
  id serial primary key,
  book_id int not null references public.books(id) on delete cascade,
  number smallint not null,
  verse_count smallint not null default 0,
  unique (book_id, number)
);
create table public.verses (
  id bigserial primary key,
  chapter_id int not null references public.chapters(id) on delete cascade,
  number smallint not null,
  osis_ref text not null,               -- GEN.1.1
  text text not null,
  unique (chapter_id, number)
);
create index verses_osis_ref_idx on public.verses (osis_ref);
alter table public.verses add column fts tsvector generated always as (to_tsvector('english', text)) stored;
create index verses_fts_idx on public.verses using gin (fts);

-- ========== Stories & scenes ==========
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  testament text check (testament in ('OT','NT')),
  start_ref text not null,
  end_ref text not null,
  body text,                            -- story-book retelling (from public-domain text)
  age_band text not null default 'all' check (age_band in ('kids','all')),
  is_bedtime boolean not null default false,
  tier_required public.tier not null default 'free',
  cover_asset_id uuid,
  order_index int not null default 0,
  review_status public.review_status not null default 'draft',
  created_at timestamptz not null default now()
);
create table public.scenes (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  order_index smallint not null,
  verse_ref text,
  caption text,
  narration text,
  review_status public.review_status not null default 'draft',
  unique (story_id, order_index)
);

-- ========== Media ==========
create table public.voices (
  id text primary key,                  -- 'device-default', 'eleven-calm-1'
  name text not null,
  provider text not null check (provider in ('device','elevenlabs','azure','human')),
  style text not null default 'narrator' check (style in ('narrator','calm','kids')),
  is_bedtime boolean not null default false,
  tier_required public.tier not null default 'free',
  feature_flag text,
  is_active boolean not null default true
);
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('story','scene','chapter')),
  owner_id text not null,
  kind public.media_kind not null,
  style public.media_style not null default 'none',
  voice_id text references public.voices(id),
  storage_bucket text not null default 'media-public',
  storage_path text not null,
  is_placeholder boolean not null default true,
  duration_s int,
  width int, height int,
  tier_required public.tier not null default 'free',
  feature_flag text,                    -- e.g. 'video_mode', 'premium_voices'
  review_status public.review_status not null default 'draft',
  created_at timestamptz not null default now()
);
create index media_assets_owner_idx on public.media_assets (owner_type, owner_id);
alter table public.stories add constraint stories_cover_fk foreign key (cover_asset_id) references public.media_assets(id) on delete set null;

create table public.audio_timings (
  asset_id uuid not null references public.media_assets(id) on delete cascade,
  verse_id bigint references public.verses(id) on delete cascade,
  seq int not null,
  start_ms int not null,
  end_ms int not null,
  primary key (asset_id, seq)
);
create table public.content_reviews (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.media_assets(id) on delete cascade,
  scene_id uuid references public.scenes(id) on delete cascade,
  reviewer_id uuid references public.profiles(id),
  kind text not null check (kind in ('art','theology','child_safety')),
  verdict text not null check (verdict in ('approve','reject','changes')),
  notes text,
  created_at timestamptz not null default now()
);
create table public.feature_flags (
  key text primary key,                 -- video_mode, premium_voices, billing, offline_media
  enabled boolean not null default false,
  description text
);

-- ========== Personal reading data ==========
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  verse_id bigint references public.verses(id) on delete cascade,
  story_id uuid references public.stories(id) on delete cascade,
  label text check (char_length(label) <= 80),
  color text,
  created_at timestamptz not null default now(),
  check (verse_id is not null or story_id is not null)
);
create index bookmarks_user_idx on public.bookmarks (user_id, created_at desc);
create table public.highlights_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  verse_id bigint not null references public.verses(id) on delete cascade,
  color text,
  note text check (char_length(note) <= 4000),
  visibility public.visibility not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index highlights_user_idx on public.highlights_notes (user_id);
create table public.reading_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  chapter_id int references public.chapters(id) on delete set null,
  story_id uuid references public.stories(id) on delete set null,
  mode public.reading_mode not null default 'text',
  started_at timestamptz not null default now(),
  seconds_active int not null default 0 check (seconds_active between 0 and 14400),
  completed boolean not null default false,
  local_date date not null default (now() at time zone 'utc')::date
);
create index reading_sessions_user_date_idx on public.reading_sessions (user_id, local_date);
create table public.user_progress (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  grace_days_left smallint not null default 2,
  grace_month date,
  journey_points int not null default 0,
  journey_level smallint not null default 1,
  total_seconds bigint not null default 0,
  chapters_completed int not null default 0,
  stories_completed int not null default 0,
  last_read_date date,
  updated_at timestamptz not null default now()
);
create table public.journey_levels (
  level smallint primary key,
  name text not null,
  min_points int not null,
  meaning text
);
create table public.bedtime_settings (
  user_id uuid primary key default auth.uid() references public.profiles(id) on delete cascade,
  sleep_timer_min smallint not null default 15 check (sleep_timer_min between 5 and 120),
  voice_id text references public.voices(id),
  speech_rate numeric(3,2) not null default 0.85,
  dim_level numeric(3,2) not null default 0.6 check (dim_level between 0 and 1),
  kids_only boolean not null default false,
  auto_stop_after_story boolean not null default true
);

-- ========== Social ==========
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status public.friend_status not null default 'pending',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (requester_id <> addressee_id)
);
create unique index friendships_pair_uidx on public.friendships (least(requester_id,addressee_id), greatest(requester_id,addressee_id));
create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 60),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  invite_code text unique not null default upper(substr(encode(gen_random_bytes(6),'hex'),1,8)),
  created_at timestamptz not null default now()
);
create table public.family_members (
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.family_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (family_id, user_id)
);
create table public.encouragements (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  preset_key text not null check (preset_key in ('praying_for_you','well_done','keep_going','read_together','god_bless')),
  created_at timestamptz not null default now()
);

-- ========== Reading plans ==========
create table public.reading_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  owner_id uuid references public.profiles(id) on delete cascade,
  family_id uuid references public.families(id) on delete cascade,
  days smallint not null check (days between 1 and 366),
  is_template boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.plan_items (
  plan_id uuid not null references public.reading_plans(id) on delete cascade,
  day_index smallint not null,
  story_id uuid references public.stories(id),
  start_ref text,
  end_ref text,
  primary key (plan_id, day_index)
);
create table public.plan_enrollments (
  plan_id uuid not null references public.reading_plans(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  started_on date not null default current_date,
  primary key (plan_id, user_id)
);
create table public.plan_progress (
  plan_id uuid not null references public.reading_plans(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  day_index smallint not null,
  completed_at timestamptz not null default now(),
  primary key (plan_id, user_id, day_index)
);

-- ========== Billing (stubbed) ==========
create table public.subscriptions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('apple','google','stripe','manual')),
  product_id text not null,
  status text not null,
  current_period_end timestamptz,
  external_id text,
  updated_at timestamptz not null default now(),
  primary key (user_id, provider)
);
create table public.entitlements (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  tier public.tier not null default 'free',
  source text not null default 'default',
  family_id uuid references public.families(id) on delete set null,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);
create table private.billing_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  raw_event jsonb not null,
  received_at timestamptz not null default now()
);
create table public.downloads (
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  asset_id uuid not null references public.media_assets(id) on delete cascade,
  device_id text not null,
  downloaded_at timestamptz not null default now(),
  expires_at timestamptz,
  primary key (user_id, asset_id, device_id)
);
create table private.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  note text
);

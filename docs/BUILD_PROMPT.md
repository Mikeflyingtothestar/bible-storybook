# Bible Storybook — Full Build Prompt

> A complete brief for an AI coding agent to build the **Bible Storybook** app: a story-book Bible for families with reading, illustrated scenes, voiceover, video stories, a gentle "Faith Journey" dashboard, family and friends, and bedtime mode.
> Build **web first**, then ship **iOS and Android from the same Expo codebase**.
> Architecture page: "Bible App: Structure & Architecture" (Mike's Library).

---

## 1. Product summary

Bible Storybook lets anyone read the whole Bible as plain text or as illustrated, narrated stories. Families read together, follow shared plans and encourage each other. At night, bedtime mode dims the screen and reads a calm story aloud with a sleep timer.

**Audience:** families with children, adult readers, churches and small groups.
**Tone:** calm, warm, story-book. Never preachy, never gamified in a way that judges faith.

### The 9 features

| # | Feature | What "done" means |
|---|---|---|
| 1 | Plain-text Bible | WEB (default), BSB, KJV; book → chapter → verse reader; search; adjustable text size; remembers last position |
| 2 | Illustrated story mode | Curated stories split into scenes; one image per scene (placeholder art until reviewed art is uploaded) |
| 3 | Voiceover | Read-aloud for chapters and stories with the current verse/scene highlighted; tap a verse to jump |
| 4 | Bookmarks + dashboard | Bookmarks, highlights, notes; dashboard with reading time, streak, chapters/stories done, Faith Journey level |
| 5 | Dark / light mode | System, Light (white), Dark, and Sepia (warm night) themes, saved per user |
| 6 | Family and friends | Friend requests by code; family groups (parent owner, max 6); shared reading plans; preset encouragements; privacy controls |
| 7 | Sign-up | Email (magic link + password), Google, Sign in with Apple |
| 8 | Video story mode (Premium) | Per-story video in **Human** (realistic) or **Anime** style; fully wired behind the `video_mode` flag with placeholder videos |
| 9 | Bedtime mode | Dimmed warm UI, calm voice, slower speech, sleep timer, kids-only filter, auto-stop after story |

### Plan tiers (billing stubbed)

| Tier | Includes | Suggested price |
|---|---|---|
| Free | Full Bible text, search, bookmarks/highlights/notes, starter illustrated stories, device voice, dashboard + level, themes, 5 friends, 1 family, 3 plans, bedtime with 15-min timer | $0 |
| Plus | All illustrated stories, premium voices (flag `premium_voices`), offline media (flag `offline_media`), unlimited plans, full bedtime library, family up to 6 | US$4.99/mo or $39.99/yr |
| Premium | Plus + video story mode Human/Anime (flag `video_mode`), offline video, Premium shared with family | US$9.99/mo or $79.99/yr |

Billing is **off** (`billing` flag = false). Tier comes from `public.entitlements` (default `free`). Build the paywall UI and an `upgrade()` stub that shows "Coming soon". Admins can set a tier manually for testing.

---

## 2. Tech stack (free tools only)

| Layer | Choice |
|---|---|
| App | **Expo (SDK latest) + React Native + Expo Router**, TypeScript strict, one codebase for web, iOS and Android |
| Web output | `expo export -p web` static export (`app.json` → `web.output: "static"`; SPA fallback) |
| Styling | Tamagui **or** NativeWind (pick one, prefer NativeWind) with a theme token file |
| State / data | `@supabase/supabase-js` v2, TanStack Query, Zustand for UI state |
| Backend | **Supabase project `nkpnanqbiehoqgnpmlhh`** (Singapore, free plan): Auth, Postgres + RLS, Storage, Edge Functions |
| Voice (phase 1) | Web Speech API on web, `expo-speech` on mobile (free). Provider interface for premium voices later |
| Audio/video | `expo-av`/`expo-audio`, `expo-video` (HLS-ready) |
| Offline | Web: IndexedDB cache of chapters; mobile: `expo-sqlite` + `expo-file-system` |
| Analytics | PostHog free tier (optional, no ad IDs), off by default |
| Hosting (web) | Cloudflare Pages (free, works with private repos); Netlify or Vercel as alternatives |
| Email | Supabase Auth custom SMTP with Resend free tier (avoids the 2-emails/hour default) |
| Tests | Vitest + React Native Testing Library; Playwright for web E2E; pgTAP-style SQL checks optional |
| CI | GitHub Actions: typecheck, lint, test, build web |

Environment variables (public only in the app):
```
EXPO_PUBLIC_SUPABASE_URL=https://nkpnanqbiehoqgnpmlhh.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<publishable/anon key from the Supabase dashboard>
EXPO_PUBLIC_SITE_URL=<deployed web URL>
```
**Never** put the service-role key, DB password, Stripe secret or webhook secrets in the app, the repo, or logs. Edge Functions read secrets from Supabase secrets only.

---

## 3. Backend (already created)

The Supabase project **bible-storybook** (`nkpnanqbiehoqgnpmlhh`) already has migrations 0001–0003 applied. Copy them into `supabase/migrations/` unchanged (they are in `docs/sql/`). Do not re-run them. New changes go in new numbered migrations.

### Tables (30, all with RLS)

- **Profiles & privacy:** `profiles` (theme, text_scale, default_version_code, friend_code, is_child, parent_id), `privacy_settings` (show_streak_to / show_level_to / show_activity_to = nobody|family|friends, discoverable_by_code).
- **Bible:** `bible_versions`, `books` (osis_code, testament, order_index), `chapters`, `verses` (osis_ref `GEN.1.1`, text, full-text `fts`).
- **Stories:** `stories` (slug, start_ref, end_ref, body, age_band kids|all, is_bedtime, tier_required, review_status), `scenes` (order_index, verse_ref, caption, narration).
- **Media:** `voices` (device|elevenlabs|azure|human, calm/narrator/kids, tier_required, feature_flag), `media_assets` (kind image|audio|video, style none|human|anime, storage_bucket/path, is_placeholder, tier_required, feature_flag, review_status), `audio_timings` (per-verse start/end ms), `content_reviews` (art|theology|child_safety), `feature_flags`, `downloads`.
- **Reading data:** `bookmarks`, `highlights_notes` (visibility private|family|friends), `reading_sessions` (mode text|audio|video|bedtime, seconds_active, completed, local_date), `user_progress`, `journey_levels`, `bedtime_settings`.
- **Social:** `friendships` (pending|accepted|blocked), `families` (owner_id, invite_code), `family_members` (owner|parent|child|member), `encouragements` (preset keys only), `reading_plans`, `plan_items`, `plan_enrollments`, `plan_progress`.
- **Billing (stub):** `subscriptions`, `entitlements`, `private.billing_events`. **Admin:** `private.admin_users`.

### RLS rules in short
- Bible text, journey levels, flags and voices: public read.
- Stories and scenes: public read when `published`; admins write.
- `media_assets`: readable only if published **and** its feature flag is on **and** the caller's tier ≥ `tier_required`. Private files live in bucket `media-private` and are served by the `media-url` Edge Function as short-lived signed URLs.
- Personal tables: `user_id = auth.uid()`. Parents can read child profiles and sessions.
- `user_progress`, `entitlements`, `subscriptions`: read-only to clients; written by RPC/Edge Functions only.
- Friends/family visibility goes through `private.shares_family()`, `private.is_friend()` and `private.can_see()`.
- Children (`is_child`) cannot send or receive friend requests or create families.

### Triggers and RPCs (already in the DB)
- `on_auth_user_created` creates profile, privacy settings, progress, entitlement (free) and bedtime settings.
- `profiles_guard` stops clients editing `is_child`, `parent_id`, `friend_code`.
- `families_owner_join` adds the creator as `owner`.
- `rpc recompute_my_progress(tz text)` returns the updated `user_progress` row.
- `rpc request_friend(code text)` sends a friend request by friend code.
- `rpc join_family(code text)` joins a family by invite code (max 6).

### Edge Functions to build
| Function | Purpose |
|---|---|
| `media-url` | Checks entitlement + flag, returns a 1-hour signed URL for `media-private` assets |
| `create-child-profile` | Parent creates a child account (no email; random internal login), sets `is_child`, `parent_id`, adds to family. Requires the parent to tick a consent box (store timestamp) |
| `billing-webhook` | Stub: verifies signature when configured, stores in `private.billing_events`, upserts `subscriptions`/`entitlements`. Returns 200 no-op while `billing` flag is off |
| `delete-account` | Deletes the caller's auth user (cascade) for GDPR/App Store compliance |
| `tts-premium` | Stub behind `premium_voices`: returns 501 until a provider key is set as a Supabase secret |

### Bible text import
Write `scripts/import-bible/` (Node, TypeScript) that downloads, parses and emits **chunked SQL seed files under 900 KB each** into `supabase/seed/` (books, chapters, verses per version). Sources (all public domain):

| Version | Source | Format | Licence |
|---|---|---|---|
| WEB | https://ebible.org/find/details.php?id=engwebp (download `engwebp_usfm.zip` or `engwebp_vpl.zip`) | USFM / VPL | Public domain |
| KJV | https://ebible.org/find/details.php?id=eng-kjv (`eng-kjv_usfm.zip`) | USFM / VPL | Public domain (Crown patent in the UK) |
| BSB | https://berean.bible/downloads.htm (`bsb.txt` or USFM) | Text / USFM | Public domain since 2023 |

Rules: canonical 66 books, Protestant order, OSIS codes (`GEN`…`REV`), strip footnotes and Strong's markup, keep words of Jesus as plain text, `osis_ref` = `BOOK.CH.V`. Set `books.chapter_count` and `chapters.verse_count`. Record licence and source URL in `bible_versions`. The seed is applied by the owner (Supabase connector or `supabase db push` with credentials kept locally); the agent never needs the DB password.

### Starter stories
Seed 30 stories (6 scenes each) in `supabase/seed/stories.sql`, written as short story-book retellings that stay close to the WEB text, with verse ranges: Creation, Adam and Eve, Noah, Tower of Babel, Abraham's Promise, Joseph, Baby Moses, The Exodus, Ten Commandments, Joshua and Jericho, Ruth, Samuel Hears God, David and Goliath, Solomon's Wisdom, Elijah, Daniel in the Lions' Den, Jonah, Esther, The Nativity, Boy Jesus in the Temple, Jesus' Baptism, Calming the Storm, Feeding the 5,000, The Good Samaritan, The Lost Sheep, The Prodigal Son, Zacchaeus, The Last Supper, The Resurrection, Pentecost. Mark 10 as `is_bedtime`, 15 as `age_band='kids'`, all `published` text with `media_assets` image placeholders (`is_placeholder=true`, bucket `media-public`, path `placeholders/scene-{n}.svg`) and video placeholders for 5 stories × human/anime (`tier_required='premium'`, `feature_flag='video_mode'`).

---

## 4. Screens and navigation (Expo Router)

```
app/
  (marketing)/index.tsx          Landing page (web only): hero, features, tiers, download/open app CTA, FAQ, privacy link
  (marketing)/privacy.tsx, terms.tsx
  (auth)/welcome, sign-in, sign-up, magic-link-sent, forgot-password, auth/callback
  (onboarding)/version, theme, goal, profile
  (tabs)/_layout.tsx             Tabs: Home · Bible · Stories · Family · Me
  (tabs)/home.tsx                Continue reading, verse of the day, today's plan, bedtime shortcut, streak chip
  (tabs)/bible/index.tsx         Version picker, book list (OT/NT)
  (tabs)/bible/[book]/index.tsx  Chapter grid
  (tabs)/bible/[book]/[chapter].tsx  Reader + listen bar + verse actions
  (tabs)/bible/search.tsx
  (tabs)/stories/index.tsx       Library with filters: Kids, Bedtime, OT, NT
  (tabs)/stories/[slug].tsx      Story detail → Read / Listen / Watch
  (tabs)/stories/[slug]/scenes.tsx   Scene reader (image + text + narration)
  (tabs)/stories/[slug]/watch.tsx    Video player with Human/Anime switch (flag + tier gated)
  (tabs)/family/index.tsx        Family group, members, shared plan progress
  (tabs)/family/friends.tsx      Friends, requests, add by code / QR
  (tabs)/family/child/new.tsx    Create child profile (parent consent)
  (tabs)/me/index.tsx            Dashboard
  (tabs)/me/journey.tsx          Faith Journey detail
  (tabs)/me/bookmarks.tsx, highlights.tsx, plans/…
  (tabs)/me/settings/…           theme, text size, voice, privacy, notifications, subscription, delete account
  bedtime/index.tsx, bedtime/play/[slug].tsx   Full-screen bedtime flow
  paywall.tsx                    Plans (stubbed purchase)
  admin/…                        (admins only) stories, scenes, media review queue, flags
```
Signed-out users can read the Bible and starter stories; saving anything prompts sign-in.

---

## 5. Design system

- **Look:** calm story-book. Soft paper background, rounded 16 px cards, generous spacing, gentle illustrations, subtle motion. No harsh red, no confetti.
- **Fonts:** serif for scripture (Literata or Source Serif 4), rounded sans for UI (Nunito or Inter). All from Google Fonts (free).
- **Themes** (tokens in `theme/tokens.ts`):

| Token | Light | Dark | Sepia |
|---|---|---|---|
| bg | #FFFFFF | #0F1220 | #F4ECD8 |
| surface | #F7F5F0 | #181C2E | #EADFC6 |
| text | #1E2230 | #ECEAF4 | #3B2F23 |
| muted | #6B7080 | #A3A8BD | #7A6A55 |
| accent | #5B6CFF | #8C9BFF | #A0672E |
| gold (levels) | #C9A227 | #E3C766 | #B8892A |

- **Bedtime palette:** near-black #0B0D14, amber text #E9C99A, brightness overlay from `bedtime_settings.dim_level`.
- Reader: text scale 0.75–2.0, line height 1.7, max width 680 px on web, verse numbers small superscript, highlight colours (yellow, green, blue, pink).

---

## 6. Feature specs

### Reader and voiceover
- Load chapter verses by `chapter_id`; cache. Swipe/arrow keys for next/previous chapter.
- Listen bar: play/pause, speed (0.75–1.5), voice picker (from `voices`, locked items show a lock and open paywall).
- `VoiceProvider` interface: `speak(segments, {voice, rate, onSegmentStart, onEnd})`, `pause`, `resume`, `stop`. Implement `DeviceVoiceProvider` (Web Speech / expo-speech), speaking verse by verse so the current verse highlights. Add `PremiumAudioProvider` that plays an `audio` media asset and highlights using `audio_timings`; enabled only when `premium_voices` is on.
- Log a `reading_sessions` row per open: count active seconds only while visible and not idle > 60 s; mark `completed` at chapter end. Call `recompute_my_progress(<device tz>)` after each session.

### Stories and video
- Scene reader: image (placeholder SVG until real art), caption, narration text, read-aloud per scene with auto-advance.
- Watch screen: segmented **Human | Anime**; looks up `media_assets` (kind video, style). If flag off → "Video stories are coming soon"; if tier too low → paywall; else call `media-url` and play (HLS on web via `hls.js` if needed).

### Bookmarks, highlights, notes
- Long-press/click verse → Bookmark, Highlight (4 colours), Note, Copy, Share (text + reference, no deep link required).
- Me → Bookmarks/Highlights lists, filter by book, jump to verse.

### Dashboard and Faith Journey
- Cards: Today's minutes, This week (bar chart by day), Current streak (and grace days left), Longest streak, Chapters done, Stories done, Bible map (books started/finished), Faith Journey level with progress to next level.
- **Points (server-side, in `recompute_my_progress`):** per reading day `min(30, minutes) + 10` (days with ≥ 1 min), `+5` per plan day completed, `+14` per full week of streak. **Streak:** day counts with ≥ 5 min or a completed item; 2 grace days per streak (a missed day is forgiven up to twice). Levels never go down.
- Levels: 1 Seed (0), 2 Sprout (150), 3 Rooted (500), 4 Growing Branch (1,200), 5 Fruitful (2,500), 6 Lamp to My Feet (5,000).
- Copy: "Your reading journey". Never "faith score", never compare people, no public leaderboards. Level hidden from others unless `show_level_to` allows.

### Family and friends
- Friend code on Me screen (+ QR on mobile). Add friend → `request_friend(code)`. Requests list: accept/decline/block.
- Create family (adults only) → invite code to share; `join_family(code)`. Owner can remove members, create child profiles, and set a family reading plan.
- Shared plan: members see each other's day ticks. Encouragements: preset buttons only (Praying for you, Well done, Keep going, Read together, God bless). No free-text chat anywhere.
- Privacy screen controls streak/level/activity visibility (default nobody) and discoverability.

### Bedtime mode
- Entry from Home and tab bar moon icon. Pick a bedtime story (`is_bedtime`, `kids_only` filter) → full-screen player: dim overlay, large calm text, slow speech (`speech_rate` 0.85), sleep timer (5–120 min) with fade-out, auto-stop after story, keep-awake while playing, no notifications during playback.

### Auth
- Supabase Auth with PKCE. Email magic link + password, Google OAuth, Sign in with Apple (required on iOS when Google is offered). Redirect URLs: `<site>/auth/callback` and the app scheme `biblestorybook://auth/callback`.
- Clear, friendly error messages for every Supabase auth error code (rate limit, invalid credentials, expired link, already registered).

### Admin (role in `private.admin_users`)
- Story/scene editor, media upload to `media-public`/`media-private`, review queue writing `content_reviews` (art → theology → child_safety → published), feature-flag toggles.

---

## 7. Content pipeline (placeholders now, real assets later)
1. Editors pick 4–8 scenes per story and link verse ranges.
2. Images: AI-generated from a locked style guide → art review → theological review → child-safety review → `published`. Until then show placeholder SVGs.
3. Voice: free device TTS now; premium TTS (ElevenLabs/Azure) later, generating audio files plus `audio_timings` via forced alignment.
4. Video: pre-rendered 3–5 min per story in Human and Anime, starting with ~20 key stories; HLS upload to `media-private`; reviewed before publish.

---

## 8. Security, privacy, child safety
- RLS everywhere (already on). Only publishable key in the client. Secrets only in Supabase secrets.
- Children: parent-created profiles only, consent timestamp recorded, first name + birth year only, no email, no friends, no free text, kids filter on, no paywall prompts in child profiles (COPPA, GDPR-K, UK Children's Code).
- Account deletion and data export in Settings. Privacy policy and terms pages on the website.
- Rate-limit friend requests (max 20/day) in the RPC or an Edge Function. Optional hCaptcha/Turnstile on sign-up.

## 9. Accessibility
WCAG 2.2 AA: contrast in all themes, screen-reader labels on every control, focus outlines on web, keyboard navigation in the reader, Dynamic Type/text scale respected, reduce-motion honoured, captions for video, tap targets ≥ 44 px.

## 10. Testing
- Unit: points/streak helpers mirrored in TS, theme tokens, voice provider segmenting.
- Component: reader, verse actions, paywall gating, bedtime timer.
- E2E (Playwright, web): sign-up with a disposable inbox, read a chapter, bookmark, switch theme, dashboard updates, add friend by code, bedtime timer stops audio.
- RLS checks: user A cannot read user B's bookmarks, child cannot send a friend request, free user cannot see premium media rows.

## 11. Deployment
- Web: `npx expo export -p web` → `dist/`. Deploy to **Cloudflare Pages** (free, works from a private repo) with SPA fallback (`_redirects`: `/* /index.html 200`). Add the site URL to Supabase Auth → URL configuration (Site URL + redirect list).
- Mobile: EAS Build free tier for Android/iOS internal builds; store submission later (needs Apple Developer $99/yr and Google Play $25 one-off; do not purchase without approval).
- CI: GitHub Actions on PR: typecheck, lint, unit tests, web export.

## 12. Roadmap
| Phase | Scope |
|---|---|
| 1 (web MVP) | Landing page, auth, reader + search, bookmarks/highlights, themes, dashboard + Faith Journey, bedtime with device TTS, friends + family basics, deploy web |
| 2 | 30 illustrated stories with scene reader, reading plans, child profiles, admin review queue, offline cache, Expo iOS/Android builds |
| 3 | Video mode (flag on with real assets), premium voices, billing (RevenueCat + Stripe), push reminders |

## Appendix — SQL
The full applied schema, RLS policies, RPCs and seed data are in `docs/sql/0001_core_schema.sql`, `docs/sql/0002_functions_rls.sql` and `docs/sql/0003_progress_rpcs_seed.sql`, reproduced below.

### 0001_core_schema.sql

```sql
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
```

### 0002_functions_rls.sql

```sql
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
```

### 0003_progress_rpcs_seed.sql

```sql
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
```

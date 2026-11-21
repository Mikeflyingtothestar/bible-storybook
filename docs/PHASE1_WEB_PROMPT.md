# Phase 1 — Web MVP (first coding-agent run)

Read `docs/BUILD_PROMPT.md` for the full product. This run builds **only** the website and web app MVP, in an Expo + Expo Router + TypeScript codebase that will later ship to iOS and Android unchanged.

## Backend (already live — do not recreate)
- Supabase project `nkpnanqbiehoqgnpmlhh` (Singapore, free). URL `https://nkpnanqbiehoqgnpmlhh.supabase.co`.
- Migrations 0001–0003 are applied (30 tables, RLS on all, triggers, RPCs `recompute_my_progress`, `request_friend`, `join_family`, seed versions/levels/flags/voices, buckets). Copy `docs/sql/*.sql` into `supabase/migrations/` as-is.
- Use only `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (publishable). Provide `.env.example`; never commit `.env`. Never use or ask for the service-role key or DB password.

## Deliverables
1. **Project setup:** Expo SDK latest, Expo Router, TypeScript strict, NativeWind, TanStack Query, Zustand, supabase-js v2 (PKCE, `detectSessionInUrl` on web), ESLint + Prettier, Vitest, Playwright, GitHub Actions (typecheck, lint, test, `expo export -p web`).
2. **Landing page** `(marketing)/index`: hero ("The Bible, told like a story"), the 9 features, Free/Plus/Premium cards (prices marked "planned"), FAQ, privacy and terms pages. Fast, SEO meta tags, responsive.
3. **Auth:** sign up / sign in with email (password + magic link), Google and Apple buttons (they work once providers are enabled in the dashboard; show a friendly message otherwise), `/auth/callback`, forgot password, sign out, friendly error map for Supabase auth codes.
4. **Onboarding:** choose version (WEB default), theme, daily goal (5/10/15 min), display name.
5. **Bible import script** `scripts/import-bible/`: downloads WEB and KJV USFM from ebible.org and BSB from berean.bible, parses to books/chapters/verses (OSIS refs, 66 books), and writes chunked SQL files (< 900 KB) to `supabase/seed/`. Commit the script and generated seeds; do not apply them (the owner applies them). Include a 3-chapter dev seed (GEN 1, PSA 23, JHN 3 in WEB) so the app works before the full import.
6. **Reader:** version picker, book list, chapter grid, chapter reader, prev/next, text size, search (Postgres `fts`), remember last position.
7. **Bookmarks, highlights, notes:** verse action sheet; Me → Bookmarks and Highlights lists.
8. **Themes:** System / Light / Dark / Sepia from tokens in BUILD_PROMPT §5, saved to `profiles.theme` (and localStorage when signed out).
9. **Voiceover (free):** `VoiceProvider` interface + `DeviceVoiceProvider` using the Web Speech API, verse-by-verse with highlight, speed control, voice list from `voices` (premium entries locked behind flag/tier).
10. **Reading sessions + dashboard:** log active seconds, call `recompute_my_progress(Intl timezone)`, dashboard cards (today, week chart, streak + grace, longest, chapters done, Faith Journey level with progress bar). Gentle copy only.
11. **Bedtime mode:** full-screen dim amber UI, pick a chapter (stories arrive in phase 2; use PSA 23, PSA 121, MAT 6:25-34, GEN 1 as bedtime readings), calm voice, rate from `bedtime_settings`, sleep timer with fade-out, auto-stop, settings saved.
12. **Family & friends basics:** show my friend code, add by code (`request_friend`), accept/decline/block requests, friends list; create family / join by code (`join_family`), member list, owner can remove; preset encouragements; privacy settings screen. No free-text messaging.
13. **Paywall stub:** `/paywall` with tiers and "Coming soon"; `useEntitlement()` hook reading `entitlements` + `feature_flags`.
14. **Account:** settings, delete-account button calling an Edge Function `delete-account` (write it in `supabase/functions/`, do not deploy).
15. **Deploy config:** static web export with SPA fallback (`public/_redirects`), README with Cloudflare Pages steps (build `npx expo export -p web`, output `dist`), and the Supabase Auth redirect URLs to add.

## Quality bar
- Lighthouse ≥ 90 on landing page; WCAG AA contrast in all themes; keyboard-navigable reader.
- Tests: unit tests for theme, voice segmenting, session timer; Playwright smoke (landing → sign up form → reader → bookmark → theme switch → bedtime timer).
- No secrets in code. No paid services. No purchases.

## Out of scope this run
Illustrated stories, video, premium voices, billing, child profiles, push, offline, mobile store builds (keep code mobile-compatible).

Open one PR with a clear summary, screenshots of landing, reader (light/dark), dashboard and bedtime, and the list of dashboard steps the owner must do (enable Google/Apple providers, add redirect URLs, apply Bible seeds, set SMTP).

# Bible Storybook

A calm, story-book Bible for families. This repository is the phase 1 website and web app: Expo (SDK 58) + Expo Router + TypeScript, built for the web first and structured so iOS and Android can ship from the same code later.

The live Supabase project is `nkpnanqbiehoqgnpmlhh` (Singapore). Migrations `0001`–`0003` are already applied. They live in `supabase/migrations/` and must not be run again.

## Scripts

```bash
npm install
npm run web          # Expo dev server
npm run typecheck
npm run lint
npm test
npm run export:web   # dist/ for GitHub Pages
npm run test:e2e     # Playwright against dist/ (export first)
npm run import:bible # rewrite SQL seeds from the public-domain sources
```

## Environment

Copy `.env.example` to `.env` for local overrides. The URL and publishable key are public and are also the defaults in `src/lib/env.ts` and `app.json`, so a build works without a secret.

Never commit a service-role key, database password, Stripe secret, or webhook secret. Billing stays a “Coming soon” paywall. Paid media stays behind feature flags (`video_mode`, `premium_voices`, `billing`, `offline_media`).

The site is a single-page web export (`web.output` is `single`) hosted at `https://mikeflyingtothestar.github.io/bible-storybook/`. `experiments.baseUrl` is `/bible-storybook`, so routes and assets include that prefix. GitHub Pages has no rewrite rules, so `npm run export:web` copies `index.html` to `404.html` (SPA fallback) and writes `.nojekyll` so the `_expo` asset folder is published.

## Bible text

The verse tables are empty until someone applies a seed. The reader falls back to a bundled World English Bible sample (Genesis 1, Psalm 23, Psalm 121, Matthew 6, John 1, John 3) and otherwise shows “text loading soon”.

`scripts/import-bible` downloads:

| Version | Source |
|---|---|
| WEB | https://ebible.org/Scriptures/engwebp_usfm.zip |
| KJV | https://ebible.org/Scriptures/eng-kjv_usfm.zip |
| BSB | https://bereanbible.com/bsb.txt (linked from https://berean.bible/downloads.htm) |

It writes chunked SQL under 900 KB to `supabase/seed/bible/<version>/` and a small dev seed to `supabase/seed/dev/web_sample.sql`. It does not connect to the database. `--apply` only checks that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present in the environment (never on the command line) and tells you to load the SQL files. The key is not printed.

Apply order, in the Supabase SQL editor:

1. Either `supabase/seed/dev/web_sample.sql` on an empty database, for a quick demo, or the full set below. Do not apply `web_sample.sql` after the full Bible. It rewrites `books.chapter_count` for Genesis, Psalms, Matthew, and John down to the handful of sample chapters.
2. For `web`, then `kjv`, then `bsb`: `00_books_chapters.sql`, then `verses_001.sql`, `verses_002.sql`, … in order.
3. `supabase/seed/stories.sql` for the 30 story retellings and placeholder media rows. Age bands are quoted string literals (`'kids'`, `'all'`). The live database already has this story data and the full WEB, BSB, and KJV text, so these files do not need to be applied again.

## One-time setup for the owner

1. **Make this repository public.** GitHub Pages is free for public repositories. In Settings → Pages, set Source to **GitHub Actions**. The workflow `.github/workflows/pages.yml` builds `npm run export:web` and deploys `dist` on every push to `main`, and it can also be run by hand. No Cloudflare or Vercel project is required.
2. **Supabase Auth → URL configuration**
   - Site URL: `https://mikeflyingtothestar.github.io/bible-storybook`
   - Redirect URLs: `https://mikeflyingtothestar.github.io/bible-storybook/auth/callback`, `http://localhost:8081/auth/callback`, and `biblestorybook://auth/callback`
3. **Google and Apple providers.** The buttons are wired. Until the providers are enabled in the Supabase dashboard, the app shows a friendly message and email sign-in still works.
4. **SMTP.** The built-in mailer is about two emails an hour. Add custom SMTP (Resend’s free tier is enough) before sharing magic links widely.
5. **Apply the Bible seeds** using the order above. Do not re-run `supabase/migrations/0001`–`0003`.
6. **Edge Functions** in `supabase/functions/` are written and not deployed. Deploy `delete-account` before the Settings button can actually remove an account. `media-url`, `create-child-profile`, `billing-webhook`, and `tts-premium` are stubs for later phases.

## Phase 1 vs later

Done in this app: landing page (features, planned prices, FAQ, privacy, terms), email sign-up and sign-in, magic link, forgot password, Google and Apple buttons, onboarding, reader with version picker, search, text size, last position, verse actions, themes, device voiceover, reading sessions and the Faith Journey dashboard, bedtime mode, friend code and family basics, paywall stub, account settings, data export, and the delete-account call.

Deferred: illustrated scene art and the review queue, video playback, premium voices, real billing, child profiles, push, offline cache, and store builds. Story text for 30 stories is readable in the app and seeded in SQL; pictures are placeholders.

# Mobile builds

The same Expo project exports the website and the native apps. Nothing in this file creates an Apple or Google account, and nothing is submitted to a store.

## Identifiers

- iOS bundle identifier: `com.mikekhoo.biblestorybook`
- Android package: `com.mikekhoo.biblestorybook`
- Icons and splash already live in `assets/images/` and are wired in `app.json`.
- Local prayer reminders use `expo-notifications`. The permission prompt appears only after someone turns a morning or evening reminder on. The website keeps that reminder on the screen and does not schedule a lock-screen alert.

## What you need before a store build

- An Expo account, free, for EAS. Sign in with `npx eas-cli@latest login`.
- Apple Developer Program, US$99 a year, before an iPhone build that installs on a device or goes to the App Store. A simulator build from the `development` profile can be made without that membership.
- Google Play Console, US$25 once, before a Play Store listing. An APK or AAB from the `preview` profile can be installed for testing without that fee.

## Check the native bundle

From this folder, before a cloud build:

```bash
npx expo-doctor
npx expo export --platform ios
npx expo export --platform android
```

Both exports should finish without a missing-module error. Web-only pieces are guarded: the service worker, Web Audio beds, and `speechSynthesis`. On a phone the sleep reading uses `expo-speech`. Ambient beds stay in the browser.

## EAS build

```bash
npx eas-cli@latest login
npx eas-cli@latest build --profile development --platform android
npx eas-cli@latest build --profile development --platform ios
npx eas-cli@latest build --profile preview --platform all
npx eas-cli@latest build --profile production --platform all
```

`development` is a dev client. On iOS that profile builds for the simulator. `preview` is an internal install. `production` is the store binary. EAS asks to create the Expo project the first time. That step is free.

Do not run submit until the store accounts exist.

## EAS submit

iOS, after the production build is finished and the Apple account can upload:

```bash
npx eas-cli@latest submit --profile production --platform ios
```

Android, after a Play Console app exists:

```bash
npx eas-cli@latest submit --profile production --platform android
```

Submit uploads the binary. It does not write the store listing. Paste the copy below by hand. Signing certificates for a public iOS release, and Play review, stay manual.

## Store listing

Title: Bible Storybook

Subtitle: Calm, sleep, and a moment to reflect

Promotional text: A few quiet minutes. Scripture underneath. No weekly billing.

Description:

Bible Storybook is a short daily practice for calm, sleep, and reflection. Scripture is the ground under it: a verse, a prayer you can finish, and a wind-down when the day is done.

What is free now: a daily verse, a short teaching, morning and night prayer, one sleep story, a small journal, and five companion questions a day. Monthly, annual, and family plans are a waitlist, not a checkout. Nothing is billed. There is no weekly plan and no trial that turns into a charge.

The companion quotes a public-domain Bible and can be wrong. It is not a therapist, a pastor, or medical care. If a message sounds like self-harm, the app shows helplines and one gentle verse. It does not keep going with advice.

A journal is saved to an account only after you sign in and press save. Mood stays on this device. A waitlist email is stored with the plan name and is not a mailing list.

Keywords: bible, prayer, sleep, calm, journal, verses, reflection, devotional

Category: Lifestyle, or Reference if the store asks for a second.

Age: 4+ or Everyone. There is no account requirement to read. The companion points to helplines and is not a chat with other people.

## Privacy nutrition

Answer from what the app actually does.

- Data used to track you: No.
- Email: Yes, if someone creates an account or joins the waitlist. Used for the account and one note when a plan opens. Not sold. Not used for ads.
- User content: Journal and gratitude text, only after sign-in and save. Bookmarks and highlights if they save them. Not sold.
- Product interaction: Reading sessions, lesson scores, and a daily count of companion questions for a signed-in person. The wording of a companion question is not stored.
- Mood, streak days, and a guest’s companion count: kept on the device. Not uploaded with the waitlist.
- Precise location, contacts, photos, health records: not collected.
- Notifications: local morning and evening reminders the person turns on. No remote push campaign.
- Data linked to the user: email and anything they save to the account.
- Data not linked to the user: none of the above is used for tracking.

Privacy policy URL, when the site is published: https://mikeflyingtothestar.github.io/bible-storybook/privacy

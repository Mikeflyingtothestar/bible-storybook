# Mobile builds

The same Expo project exports the website and the native apps. Nothing in this file creates an Apple or Google account, and nothing is submitted to a store.

## Identifiers

- iOS bundle identifier: `com.mikekhoo.biblestorybook`
- Android package: `com.mikekhoo.biblestorybook`
- Icons and splash already live in `assets/images/` and are wired in `app.json`.

## What you need before a store build

- An Expo account, free, for EAS. Sign in with `npx eas-cli@latest login`.
- Apple Developer Program, US$99 a year, before an iPhone build that installs on a device or goes to the App Store. A simulator build from the `development` profile can be made without that membership.
- Google Play Console, US$25 once, before a Play Store listing. An APK or AAB from the `preview` profile can be installed for testing without that fee.

## Commands

From this folder:

```bash
npx expo-doctor
npx expo export --platform android
npx expo export --platform ios
npx eas-cli@latest build --profile development --platform android
npx eas-cli@latest build --profile preview --platform all
npx eas-cli@latest build --profile production --platform all
```

`development` is a dev client. On iOS that profile builds for the simulator. `preview` is an internal install. `production` is the store build. Do not run `eas submit` until you have decided to pay for the store accounts.

EAS will ask you to create the project on Expo’s servers the first time. That step is free. Store listing, signing certificates for a public iOS release, and Play review are the paid or manual parts.

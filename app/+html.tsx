import { ScrollViewStyleReset } from 'expo-router/html'
import type { ReactNode } from 'react'

const site = process.env.EXPO_PUBLIC_SITE_URL?.replace(/\/$/, '')

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Bible Storybook — daily verse, Bible, and verses for anxiety</title>
        <meta
          name="description"
          content="A calm Bible app for a daily verse, short teachings, and verses for anxiety. Read or listen, then rest. Public-domain Bible text. No weekly billing."
        />
        <meta name="theme-color" content="#F7F5F0" />
        <meta property="og:title" content="Bible Storybook — daily verse" />
        <meta property="og:description" content="Daily verse, Bible reading, and verses for anxiety in a calm app." />
        <meta property="og:type" content="website" />
        {site ? <link rel="canonical" href={site} /> : null}
        {site ? <meta property="og:url" content={site} /> : null}
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  )
}

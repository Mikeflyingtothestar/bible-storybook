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
        <title>Bible Storybook — The Bible, told like a story</title>
        <meta
          name="description"
          content="A calm story-book Bible for families. Read the World English Bible, BSB, and KJV, keep a gentle reading journey, and wind down with bedtime mode."
        />
        <meta name="theme-color" content="#F7F5F0" />
        <meta property="og:title" content="Bible Storybook" />
        <meta property="og:description" content="The Bible, told like a story. Read, listen, and rest." />
        <meta property="og:type" content="website" />
        {site ? <link rel="canonical" href={site} /> : null}
        {site ? <meta property="og:url" content={site} /> : null}
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  )
}

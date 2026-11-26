import { ScrollViewStyleReset } from 'expo-router/html'
import type { ReactNode } from 'react'

const site = (process.env.EXPO_PUBLIC_SITE_URL || 'https://mikeflyingtothestar.github.io/bible-storybook').replace(/\/$/, '')
const title = 'Bible Storybook — a few quiet minutes'
const description = 'A few quiet minutes for a daily verse, prayer, sleep, and a private journal. Public-domain Bible text. No weekly billing.'

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#F7F4EE" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${site}/`} />
        <meta property="og:image" content={`${site}/og.webp`} />
        <link rel="canonical" href={`${site}/`} />
        <link rel="manifest" href={`${site}/manifest.webmanifest`} />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  )
}

import { copyFileSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { collectRoutes } from './site-routes.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const distDir = path.join(root, 'dist')
const indexPath = path.join(distDir, 'index.html')
const site = (process.env.EXPO_PUBLIC_SITE_URL || 'https://mikeflyingtothestar.github.io/bible-storybook').replace(/\/$/, '')
const title = 'Bible Storybook — a few quiet minutes'
const description = 'A few quiet minutes for a daily verse, prayer, sleep, and a private journal. Public-domain Bible text. No weekly billing.'
const image = `${site}/og.webp`

const csp = `default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self' https://nkpnanqbiehoqgnpmlhh.supabase.co https://accounts.google.com https://appleid.apple.com; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; media-src 'self' blob:; worker-src 'self' blob:`

function replaceTag(html, pattern, tag) {
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

let html = readFileSync(indexPath, 'utf8')
html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
html = replaceTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`)
html = replaceTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
html = replaceTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${description}" />`)
html = replaceTag(html, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="website" />`)
html = replaceTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${site}/" />`)
html = replaceTag(html, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${image}" />`)
html = replaceTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${site}/" />`)
html = replaceTag(html, /<link rel="manifest"[^>]*>/, `<link rel="manifest" href="${site}/manifest.webmanifest" />`)
html = replaceTag(html, /<meta http-equiv="Content-Security-Policy"[^>]*>/, `<meta http-equiv="Content-Security-Policy" content="${csp}" />`)
html = replaceTag(html, /<meta name="theme-color"[^>]*>/, `<meta name="theme-color" content="#F7F4EE" />`)

function findHero(dir) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      const found = findHero(full)
      if (found) return found
    } else if (entry.startsWith('sunrise-sky.') && entry.endsWith('.webp')) return full
  }
  return null
}
const hero = findHero(distDir)
if (hero) {
  const href = `/bible-storybook/${path.relative(distDir, hero).split(path.sep).join('/')}`
  html = replaceTag(html, /<link rel="preload" as="image"[^>]*>/, `<link rel="preload" as="image" href="${href}" />`)
}

writeFileSync(indexPath, html)
writeFileSync(path.join(distDir, '404.html'), html)
writeFileSync(path.join(distDir, '.nojekyll'), '')
copyFileSync(path.join(root, 'assets/art/sunrise-sky.webp'), path.join(distDir, 'og.webp'))

let pages = 0
for (const route of collectRoutes()) {
  if (route === '/') continue
  const relative = route.slice(1)
  const file = path.join(distDir, `${relative}.html`)
  const nested = path.join(distDir, relative, 'index.html')
  mkdirSync(path.dirname(file), { recursive: true })
  mkdirSync(path.dirname(nested), { recursive: true })
  writeFileSync(file, html)
  writeFileSync(nested, html)
  pages += 1
}

console.log(`Stamped ${site}, wrote ${pages} route pages, dist/404.html, and dist/.nojekyll`)

import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const distDir = fileURLToPath(new URL('../dist/', import.meta.url))
const indexPath = path.join(distDir, 'index.html')
const site = (process.env.EXPO_PUBLIC_SITE_URL || 'https://mikeflyingtothestar.github.io/bible-storybook').replace(/\/$/, '')
const html = readFileSync(indexPath, 'utf8')
const tags = `
    <title>Bible Storybook — The Bible, told like a story</title>
    <meta name="description" content="A calm story-book Bible for families. Read the World English Bible, BSB, and KJV, keep a gentle reading journey, and wind down with bedtime mode." />
    <meta name="theme-color" content="#F7F5F0" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self' https://nkpnanqbiehoqgnpmlhh.supabase.co https://accounts.google.com https://appleid.apple.com; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; media-src 'self' blob:; worker-src 'self' blob:" />
    <link rel="canonical" href="${site}/" />
    <meta property="og:title" content="Bible Storybook" />
    <meta property="og:description" content="The Bible, told like a story. Read, listen, and rest." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${site}/" />
`
const next = html.replace(/<title>[\s\S]*?<\/title>/, tags.trim())
writeFileSync(indexPath, next)
copyFileSync(indexPath, path.join(distDir, '404.html'))
writeFileSync(path.join(distDir, '.nojekyll'), '')
console.log(`Stamped ${site} and wrote dist/404.html plus dist/.nojekyll`)

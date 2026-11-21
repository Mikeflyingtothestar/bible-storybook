import { readFileSync, writeFileSync } from 'node:fs'

const file = new URL('../dist/index.html', import.meta.url)
const html = readFileSync(file, 'utf8')
const tags = `
    <title>Bible Storybook — The Bible, told like a story</title>
    <meta name="description" content="A calm story-book Bible for families. Read the World English Bible, BSB, and KJV, keep a gentle reading journey, and wind down with bedtime mode." />
    <meta name="theme-color" content="#F7F5F0" />
    <meta property="og:title" content="Bible Storybook" />
    <meta property="og:description" content="The Bible, told like a story. Read, listen, and rest." />
    <meta property="og:type" content="website" />
`
const next = html.replace(/<title>[\s\S]*?<\/title>/, tags.trim())
writeFileSync(file, next)
console.log('Stamped SEO tags into dist/index.html')

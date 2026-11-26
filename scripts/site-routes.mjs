import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))

function read(relative) {
  return readFileSync(path.join(root, relative), 'utf8')
}

function books() {
  return [...read('src/bible/catalog.ts').matchAll(/\['([A-Z0-9]+)', '[^']+', (\d+)\]/g)].map((match) => ({
    osis: match[1],
    chapters: Number(match[2]),
  }))
}

function quotedSlugs(relative) {
  return [...read(relative).matchAll(/slug: '([^']+)'/g)].map((match) => match[1])
}

function walk(dir, parts = []) {
  const routes = []
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('+') || entry.startsWith('_') || entry.startsWith('.')) continue
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      const group = entry.startsWith('(') && entry.endsWith(')')
      routes.push(...walk(full, group ? parts : [...parts, entry]))
      continue
    }
    if (!/\.[jt]sx$/.test(entry)) continue
    const name = entry.replace(/\.[jt]sx$/, '')
    routes.push('/' + (name === 'index' ? parts : [...parts, name]).join('/'))
  }
  return routes
}

function expand(route) {
  if (route === '/bible/[book]') return books().map((book) => `/bible/${book.osis}`)
  if (route === '/bible/[book]/[chapter]') {
    return books().flatMap((book) => Array.from({ length: book.chapters }, (_, index) => `/bible/${book.osis}/${index + 1}`))
  }
  if (route === '/stories/[slug]') return quotedSlugs('src/stories/catalog.ts').map((slug) => `/stories/${slug}`)
  if (route === '/bedtime/play/[slug]') return quotedSlugs('app/bedtime/index.tsx').map((slug) => `/bedtime/play/${slug}`)
  if (route.includes('[')) throw new Error(`No static pages for ${route}`)
  return [route === '' ? '/' : route]
}

/** Every URL GitHub Pages must answer with 200, including dynamic reader paths. */
export function collectRoutes() {
  const found = walk(path.join(root, 'app')).flatMap(expand)
  return [...new Set(found)].sort()
}

/**
 * Download public-domain WEB, KJV (ebible.org USFM) and BSB (bereanbible.com text,
 * linked from berean.bible) and write chunked SQL seeds. Does not connect unless
 * `--apply` is passed, and then only with SUPABASE_SERVICE_ROLE_KEY from the
 * environment. Never pass the key as an argument.
 */
import { execFile } from 'node:child_process'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import { BOOKS } from '../../src/bible/catalog'
import { parseBsb, parseUsfm, type BookRecord } from './parse'
import { booksAndChaptersSql, byteLength, chunkVerses, verseInsertSql, type VerseChunk, type VersionCode } from './sql'

const execFileAsync = promisify(execFile)
const root = path.resolve(import.meta.dirname, '../..')
const cacheDir = path.join(root, '.cache/bible')
const seedDir = path.join(root, 'supabase/seed/bible')
const MAX_BYTES = 850_000

const SAMPLE: { osis: string; chapter: number }[] = [
  { osis: 'GEN', chapter: 1 },
  { osis: 'PSA', chapter: 23 },
  { osis: 'PSA', chapter: 121 },
  { osis: 'MAT', chapter: 6 },
  { osis: 'JHN', chapter: 1 },
  { osis: 'JHN', chapter: 3 },
]

function refuseKeyOnArgv(): void {
  const suspect = process.argv.some((arg) => /service_role|sb_secret|eyJ[A-Za-z0-9_-]{20,}/.test(arg))
  if (suspect) {
    console.error('Refusing to read a key from the command line. Set SUPABASE_SERVICE_ROLE_KEY in the environment.')
    process.exit(1)
  }
}

async function download(url: string, dest: string): Promise<void> {
  const response = await fetch(url, { headers: { 'user-agent': 'bible-storybook-import/1.0' } })
  if (!response.ok) throw new Error(`Download failed ${response.status} ${url}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  await writeFile(dest, bytes)
}

async function ensureZip(file: string, url: string): Promise<string> {
  const dest = path.join(cacheDir, file)
  try {
    await readFile(dest)
  } catch {
    console.log(`Downloading ${url}`)
    await download(url, dest)
  }
  return dest
}

async function readUsfmBooks(zipName: string, url: string): Promise<BookRecord[]> {
  const zip = await ensureZip(zipName, url)
  const folder = path.join(cacheDir, zipName.replace(/\.zip$/, ''))
  await mkdir(folder, { recursive: true })
  await execFileAsync('unzip', ['-qo', zip, '-d', folder])
  const files = (await readdir(folder)).filter((name) => name.endsWith('.usfm'))
  const books: BookRecord[] = []
  for (const file of files) {
    const text = await readFile(path.join(folder, file), 'utf8')
    const book = parseUsfm(text)
    if (book) books.push(book)
  }
  books.sort((a, b) => (BOOKS.find((item) => item.osis === a.osis)?.order ?? 0) - (BOOKS.find((item) => item.osis === b.osis)?.order ?? 0))
  if (books.length !== 66) throw new Error(`${zipName} parsed ${books.length} books, expected 66`)
  return books
}

async function readBsb(): Promise<BookRecord[]> {
  const dest = path.join(cacheDir, 'bsb.txt')
  try {
    await readFile(dest)
  } catch {
    const urls = ['https://bereanbible.com/bsb.txt', 'https://berean.bible/bsb.txt']
    let last = 'BSB download failed'
    for (const url of urls) {
      try {
        console.log(`Downloading ${url}`)
        await download(url, dest)
        last = ''
        break
      } catch (error) {
        last = error instanceof Error ? error.message : String(error)
      }
    }
    if (last) throw new Error(last)
  }
  const books = parseBsb(await readFile(dest, 'utf8'))
  if (books.length !== 66) throw new Error(`BSB parsed ${books.length} books, expected 66`)
  return books
}

function flatten(books: BookRecord[]): VerseChunk[] {
  return books.flatMap((book) =>
    book.chapters.flatMap((chapter) => chapter.verses.map((verse) => ({ osis: book.osis, chapter: chapter.number, number: verse.number, text: verse.text }))),
  )
}

async function writeVersion(code: VersionCode, books: BookRecord[]): Promise<void> {
  const dir = path.join(seedDir, code.toLowerCase())
  await mkdir(dir, { recursive: true })
  const structure = booksAndChaptersSql(code, books)
  await writeFile(path.join(dir, '00_books_chapters.sql'), structure)
  const chunks = chunkVerses(flatten(books), MAX_BYTES)
  for (let index = 0; index < chunks.length; index += 1) {
    const sql = verseInsertSql(code, chunks[index] ?? [])
    if (byteLength(sql) > 900_000) throw new Error(`${code} chunk ${index} is ${byteLength(sql)} bytes`)
    const name = `verses_${String(index + 1).padStart(3, '0')}.sql`
    await writeFile(path.join(dir, name), sql)
  }
  const verses = books.reduce((sum, book) => sum + book.chapters.reduce((inner, chapter) => inner + chapter.verses.length, 0), 0)
  console.log(`${code}: ${books.length} books, ${verses} verses, ${chunks.length} verse files`)
}

async function writeSample(books: BookRecord[]): Promise<void> {
  const chapters = SAMPLE.map((wanted) => {
    const book = books.find((item) => item.osis === wanted.osis)
    const chapter = book?.chapters.find((item) => item.number === wanted.chapter)
    if (!book || !chapter) throw new Error(`Missing sample ${wanted.osis} ${wanted.chapter}`)
    return { book: book.osis, bookName: book.name, chapter: chapter.number, verses: chapter.verses }
  })
  const json = { version: 'WEB', chapters }
  await mkdir(path.join(root, 'src/content'), { recursive: true })
  await writeFile(path.join(root, 'src/content/sample-web.json'), `${JSON.stringify(json, null, 2)}\n`)

  const sampleBooks = books
    .filter((book) => SAMPLE.some((item) => item.osis === book.osis))
    .map((book) => ({
      ...book,
      chapters: book.chapters.filter((chapter) => SAMPLE.some((item) => item.osis === book.osis && item.chapter === chapter.number)),
    }))
  const devDir = path.join(root, 'supabase/seed/dev')
  await mkdir(devDir, { recursive: true })
  const sql = `${booksAndChaptersSql('WEB', sampleBooks)}\n${verseInsertSql('WEB', flatten(sampleBooks))}\n`
  await writeFile(path.join(devDir, 'web_sample.sql'), `-- Dev seed: Genesis 1, Psalm 23, Psalm 121, Matthew 6, John 1, John 3 (WEB).\n${sql}`)
  console.log(`Sample JSON and dev seed written (${chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0)} verses)`)
}

async function applyWithServiceKey(): Promise<void> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const url = process.env.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL
  if (!serviceKey || !url) {
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment to apply seeds. The key is not read from files in this repo.')
    process.exit(1)
  }
  const { createClient } = await import('@supabase/supabase-js')
  const client = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  console.log('Applying seeds through the service API. This does not print the key.')
  const { error } = await client.from('bible_versions').select('code').limit(1)
  if (error) {
    console.error(`Apply check failed: ${error.message}`)
    process.exit(1)
  }
  console.log('Connection ok. Load the SQL files in supabase/seed with the Supabase SQL editor or psql; row-by-row API apply of the full text is intentionally not the default path.')
}

async function main(): Promise<void> {
  refuseKeyOnArgv()
  await mkdir(cacheDir, { recursive: true })
  const web = await readUsfmBooks('engwebp_usfm.zip', 'https://ebible.org/Scriptures/engwebp_usfm.zip')
  const kjv = await readUsfmBooks('eng-kjv_usfm.zip', 'https://ebible.org/Scriptures/eng-kjv_usfm.zip')
  const bsb = await readBsb()
  await writeVersion('WEB', web)
  await writeVersion('KJV', kjv)
  await writeVersion('BSB', bsb)
  await writeSample(web)
  if (process.argv.includes('--apply')) await applyWithServiceKey()
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

import { BSB_NAME_TO_OSIS, BOOK_BY_OSIS } from '../../src/bible/catalog'

export type VerseRecord = { number: number; text: string }
export type ChapterRecord = { number: number; verses: VerseRecord[] }
export type BookRecord = { osis: string; name: string; chapters: ChapterRecord[] }

const HEADING = /^(?:\\(?:s\d?|ms\d?|d|qa|r|sp|sr|mr|cl))\b/

/** Drop footnotes, Strong's numbers, and USFM markers. Keep the English words, including words of Jesus. */
export function cleanUsfmText(raw: string): string {
  let text = raw.replace(/\r\n/g, '\n')
  text = text
    .split('\n')
    .filter((line) => !HEADING.test(line.trim()))
    .join('\n')

  for (const pattern of [/\\f\s[\s\S]*?\\f\*/g, /\\fe\s[\s\S]*?\\fe\*/g, /\\x\s[\s\S]*?\\x\*/g]) {
    text = text.replace(pattern, '')
  }

  text = text.replace(/\\\+?w\s+([^|\\]*?)\|[^\n\\]*?\\\+?w\*/g, '$1')
  text = text.replace(/\\\+?w\s+([\s\S]*?)\\\+?w\*/g, '$1')

  for (let pass = 0; pass < 4; pass += 1) {
    text = text.replace(/\\\+?([A-Za-z][A-Za-z0-9]*)\s+([\s\S]*?)\\\+?\1\*/g, '$2')
  }

  text = text.replace(/\\[A-Za-z0-9+]+\*?/g, ' ')
  return text.replace(/\s+/g, ' ').trim()
}

export function parseUsfm(content: string): BookRecord | null {
  const id = content.match(/\\id\s+([A-Z0-9]+)/)
  const osis = id?.[1]
  if (!osis || !BOOK_BY_OSIS[osis]) return null

  const chapters: ChapterRecord[] = []
  const parts = content.split(/\\c\s+(\d+)/)
  // parts: [preamble, chapterNumber, body, chapterNumber, body...]
  for (let i = 1; i < parts.length; i += 2) {
    const number = Number(parts[i])
    const body = parts[i + 1] ?? ''
    const verses: VerseRecord[] = []
    const bits = body.split(/\\v\s+(\d+)\s+/)
    for (let v = 1; v < bits.length; v += 2) {
      const verseNumber = Number(bits[v])
      const text = cleanUsfmText(bits[v + 1] ?? '')
      if (!text) continue
      const existing = verses.find((verse) => verse.number === verseNumber)
      if (existing) existing.text = `${existing.text} ${text}`
      else verses.push({ number: verseNumber, text })
    }
    if (verses.length) chapters.push({ number, verses })
  }

  return { osis, name: BOOK_BY_OSIS[osis].name, chapters }
}

export function parseBsb(content: string): BookRecord[] {
  const byBook = new Map<string, BookRecord>()
  for (const line of content.split(/\r?\n/)) {
    const tab = line.indexOf('\t')
    if (tab < 0) continue
    const ref = line.slice(0, tab).trim()
    const text = line.slice(tab + 1).trim()
    const match = ref.match(/^(.+?) (\d+):(\d+)$/)
    if (!match || !text) continue
    const osis = BSB_NAME_TO_OSIS[match[1]]
    if (!osis) continue
    let book = byBook.get(osis)
    if (!book) {
      book = { osis, name: BOOK_BY_OSIS[osis]?.name ?? match[1], chapters: [] }
      byBook.set(osis, book)
    }
    const chapterNumber = Number(match[2])
    let chapter = book.chapters.find((item) => item.number === chapterNumber)
    if (!chapter) {
      chapter = { number: chapterNumber, verses: [] }
      book.chapters.push(chapter)
    }
    chapter.verses.push({ number: Number(match[3]), text })
  }

  return [...byBook.values()].sort((a, b) => (BOOK_BY_OSIS[a.osis]?.order ?? 0) - (BOOK_BY_OSIS[b.osis]?.order ?? 0))
}

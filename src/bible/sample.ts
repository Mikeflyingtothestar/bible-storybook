import sample from '../content/sample-web.json'
import { bookByOsis } from './catalog'

export type SampleVerse = { number: number; text: string }

export type SampleChapter = {
  book: string
  bookName: string
  chapter: number
  verses: SampleVerse[]
}

type SampleFile = {
  version: string
  chapters: SampleChapter[]
}

const file = sample as SampleFile

export const SAMPLE_LABEL = 'Genesis 1, Psalm 23, Psalm 121, Matthew 6, John 1, and John 3'

export function bundledChapter(book: string, chapter: number): SampleChapter | null {
  const found = file.chapters.find((item) => item.book === book && item.chapter === chapter)
  if (!found) return null
  return found
}

export function searchSample(query: string): { osisRef: string; text: string; book: string; chapter: number; number: number }[] {
  const needle = query.trim().toLowerCase()
  if (needle.length < 2) return []
  const hits: { osisRef: string; text: string; book: string; chapter: number; number: number }[] = []
  for (const chapter of file.chapters) {
    for (const verse of chapter.verses) {
      if (verse.text.toLowerCase().includes(needle)) {
        hits.push({
          osisRef: `${chapter.book}.${chapter.chapter}.${verse.number}`,
          text: verse.text,
          book: chapter.book,
          chapter: chapter.chapter,
          number: verse.number,
        })
      }
      if (hits.length >= 30) return hits
    }
  }
  return hits
}

export function referenceLabel(book: string, chapter: number, verse?: number): string {
  const name = bookByOsis(book)?.name ?? book
  return verse ? `${name} ${chapter}:${verse}` : `${name} ${chapter}`
}

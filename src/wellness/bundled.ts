import { bundledChapter, referenceLabel } from '../bible/sample'

export type CitedVerse = {
  osisRef: string
  label: string
  text: string
}

export function verseByRef(osisRef: string): CitedVerse | null {
  const parts = osisRef.split('.')
  if (parts.length !== 3) return null
  const book = parts[0] ?? ''
  const chapter = Number(parts[1])
  const number = Number(parts[2])
  if (!book || !Number.isInteger(chapter) || !Number.isInteger(number)) return null
  const found = bundledChapter(book, chapter)?.verses.find((verse) => verse.number === number)
  if (!found) return null
  return { osisRef, label: referenceLabel(book, chapter, number), text: found.text }
}

export function requireVerse(osisRef: string): CitedVerse {
  const verse = verseByRef(osisRef)
  if (!verse) throw new Error(`Bundled Bible is missing ${osisRef}`)
  return verse
}

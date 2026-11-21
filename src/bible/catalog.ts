export type Testament = 'OT' | 'NT'

export type BookInfo = {
  osis: string
  name: string
  testament: Testament
  chapters: number
  order: number
}

const OT: [string, string, number][] = [
  ['GEN', 'Genesis', 50],
  ['EXO', 'Exodus', 40],
  ['LEV', 'Leviticus', 27],
  ['NUM', 'Numbers', 36],
  ['DEU', 'Deuteronomy', 34],
  ['JOS', 'Joshua', 24],
  ['JDG', 'Judges', 21],
  ['RUT', 'Ruth', 4],
  ['1SA', '1 Samuel', 31],
  ['2SA', '2 Samuel', 24],
  ['1KI', '1 Kings', 22],
  ['2KI', '2 Kings', 25],
  ['1CH', '1 Chronicles', 29],
  ['2CH', '2 Chronicles', 36],
  ['EZR', 'Ezra', 10],
  ['NEH', 'Nehemiah', 13],
  ['EST', 'Esther', 10],
  ['JOB', 'Job', 42],
  ['PSA', 'Psalms', 150],
  ['PRO', 'Proverbs', 31],
  ['ECC', 'Ecclesiastes', 12],
  ['SNG', 'Song of Solomon', 8],
  ['ISA', 'Isaiah', 66],
  ['JER', 'Jeremiah', 52],
  ['LAM', 'Lamentations', 5],
  ['EZK', 'Ezekiel', 48],
  ['DAN', 'Daniel', 12],
  ['HOS', 'Hosea', 14],
  ['JOL', 'Joel', 3],
  ['AMO', 'Amos', 9],
  ['OBA', 'Obadiah', 1],
  ['JON', 'Jonah', 4],
  ['MIC', 'Micah', 7],
  ['NAM', 'Nahum', 3],
  ['HAB', 'Habakkuk', 3],
  ['ZEP', 'Zephaniah', 3],
  ['HAG', 'Haggai', 2],
  ['ZEC', 'Zechariah', 14],
  ['MAL', 'Malachi', 4],
]

const NT: [string, string, number][] = [
  ['MAT', 'Matthew', 28],
  ['MRK', 'Mark', 16],
  ['LUK', 'Luke', 24],
  ['JHN', 'John', 21],
  ['ACT', 'Acts', 28],
  ['ROM', 'Romans', 16],
  ['1CO', '1 Corinthians', 16],
  ['2CO', '2 Corinthians', 13],
  ['GAL', 'Galatians', 6],
  ['EPH', 'Ephesians', 6],
  ['PHP', 'Philippians', 4],
  ['COL', 'Colossians', 4],
  ['1TH', '1 Thessalonians', 5],
  ['2TH', '2 Thessalonians', 3],
  ['1TI', '1 Timothy', 6],
  ['2TI', '2 Timothy', 4],
  ['TIT', 'Titus', 3],
  ['PHM', 'Philemon', 1],
  ['HEB', 'Hebrews', 13],
  ['JAS', 'James', 5],
  ['1PE', '1 Peter', 5],
  ['2PE', '2 Peter', 3],
  ['1JN', '1 John', 5],
  ['2JN', '2 John', 1],
  ['3JN', '3 John', 1],
  ['JUD', 'Jude', 1],
  ['REV', 'Revelation', 22],
]

function build(rows: [string, string, number][], testament: Testament, start: number): BookInfo[] {
  return rows.map(([osis, name, chapters], index) => ({
    osis,
    name,
    testament,
    chapters,
    order: start + index + 1,
  }))
}

export const BOOKS: BookInfo[] = [...build(OT, 'OT', 0), ...build(NT, 'NT', OT.length)]

export const BOOK_BY_OSIS: Record<string, BookInfo> = Object.fromEntries(BOOKS.map((book) => [book.osis, book]))

/** Names as they appear in the Berean Standard Bible text file. */
export const BSB_NAME_TO_OSIS: Record<string, string> = {
  ...Object.fromEntries(BOOKS.map((book) => [book.name, book.osis])),
  Psalm: 'PSA',
  Psalms: 'PSA',
}

export function bookByOsis(osis: string): BookInfo | undefined {
  return BOOK_BY_OSIS[osis.toUpperCase()]
}

export function neighborChapter(osis: string, chapter: number, direction: 1 | -1): { osis: string; chapter: number } | null {
  const book = bookByOsis(osis)
  if (!book) return null
  const next = chapter + direction
  if (next >= 1 && next <= book.chapters) return { osis: book.osis, chapter: next }
  const index = BOOKS.findIndex((item) => item.osis === book.osis)
  const other = BOOKS[index + direction]
  if (!other) return null
  return { osis: other.osis, chapter: direction === 1 ? 1 : other.chapters }
}

export const VERSIONS = [
  { code: 'WEB', name: 'World English Bible' },
  { code: 'BSB', name: 'Berean Standard Bible' },
  { code: 'KJV', name: 'King James Version' },
] as const

export type VersionCode = (typeof VERSIONS)[number]['code']

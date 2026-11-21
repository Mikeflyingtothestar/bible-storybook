import { BOOK_BY_OSIS } from '../../src/bible/catalog'
import type { BookRecord } from './parse'

export function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

export function byteLength(value: string): number {
  return Buffer.byteLength(value, 'utf8')
}

const VERSIONS = {
  WEB: {
    name: 'World English Bible',
    license: 'Public domain',
    source: 'https://ebible.org/find/details.php?id=engwebp',
  },
  BSB: {
    name: 'Berean Standard Bible',
    license: 'Public domain (dedicated 2023)',
    source: 'https://berean.bible/downloads.htm',
  },
  KJV: {
    name: 'King James Version',
    license: 'Public domain (Crown patent applies in the UK)',
    source: 'https://ebible.org/find/details.php?id=eng-kjv',
  },
} as const

export type VersionCode = keyof typeof VERSIONS

export function booksAndChaptersSql(code: VersionCode, books: BookRecord[]): string {
  const meta = VERSIONS[code]
  const bookRows = books
    .map((book) => {
      const info = BOOK_BY_OSIS[book.osis]
      return `(${sqlString(book.osis)}, ${sqlString(info?.name ?? book.name)}, ${sqlString(info?.testament ?? 'OT')}, ${info?.order ?? 0}, ${book.chapters.length})`
    })
    .join(',\n')
  const chapterRows = books
    .flatMap((book) => book.chapters.map((chapter) => `(${sqlString(book.osis)}, ${chapter.number}, ${chapter.verses.length})`))
    .join(',\n')

  return `-- ${code} books and chapters. Apply before verse files. Safe to re-run.
insert into public.bible_versions (code, name, language, license, source_url, is_public_domain, is_active)
values (${sqlString(code)}, ${sqlString(meta.name)}, 'en', ${sqlString(meta.license)}, ${sqlString(meta.source)}, true, true)
on conflict (code) do update set name = excluded.name, license = excluded.license, source_url = excluded.source_url;

insert into public.books (version_id, osis_code, name, testament, order_index, chapter_count)
select v.id, x.osis, x.name, x.testament, x.ord, x.chapters
from public.bible_versions v
join (values
${bookRows}
) as x(osis, name, testament, ord, chapters) on true
where v.code = ${sqlString(code)}
on conflict (version_id, osis_code) do update set
  name = excluded.name,
  testament = excluded.testament,
  order_index = excluded.order_index,
  chapter_count = excluded.chapter_count;

insert into public.chapters (book_id, number, verse_count)
select b.id, x.num, x.verses
from public.books b
join public.bible_versions v on v.id = b.version_id and v.code = ${sqlString(code)}
join (values
${chapterRows}
) as x(osis, num, verses) on b.osis_code = x.osis
on conflict (book_id, number) do update set verse_count = excluded.verse_count;
`
}

export type VerseChunk = { osis: string; chapter: number; number: number; text: string }

export function verseInsertSql(code: VersionCode, rows: VerseChunk[]): string {
  const values = rows
    .map((row) => `(${sqlString(row.osis)}, ${row.chapter}, ${row.number}, ${sqlString(`${row.osis}.${row.chapter}.${row.number}`)}, ${sqlString(row.text)})`)
    .join(',\n')
  return `-- ${code} verses (${rows.length}). Requires books and chapters first.
insert into public.verses (chapter_id, number, osis_ref, text)
select c.id, x.verse, x.ref, x.body
from (values
${values}
) as x(osis, chapter, verse, ref, body)
join public.books b on b.osis_code = x.osis
join public.bible_versions v on v.id = b.version_id and v.code = ${sqlString(code)}
join public.chapters c on c.book_id = b.id and c.number = x.chapter
on conflict (chapter_id, number) do update set osis_ref = excluded.osis_ref, text = excluded.text;
`
}

export function chunkVerses(rows: VerseChunk[], maxBytes: number): VerseChunk[][] {
  const chunks: VerseChunk[][] = []
  let current: VerseChunk[] = []
  let size = 0
  for (const row of rows) {
    const cost = byteLength(row.text) + row.osis.length + 48
    if (current.length && size + cost > maxBytes) {
      chunks.push(current)
      current = []
      size = 0
    }
    current.push(row)
    size += cost
  }
  if (current.length) chunks.push(current)
  return chunks
}

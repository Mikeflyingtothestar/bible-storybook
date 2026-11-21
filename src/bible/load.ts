import { supabase } from '../lib/supabase'
import { bookByOsis, type VersionCode } from './catalog'
import { bundledChapter, searchSample, type SampleVerse } from './sample'

export type LoadedVerse = SampleVerse & { id: number | null; osisRef: string }
export type LoadedChapter = {
  version: VersionCode
  book: string
  bookName: string
  chapter: number
  chapterId: number | null
  verses: LoadedVerse[]
  source: 'library' | 'sample' | 'empty'
}

export type SearchHit = {
  osisRef: string
  text: string
  book: string
  chapter: number
  number: number
  source: 'library' | 'sample'
}

type RemoteVerse = {
  id: number
  chapter_id: number
  number: number
  osis_ref: string
  text: string
}

export async function loadChapter(version: VersionCode, book: string, chapter: number): Promise<LoadedChapter> {
  const info = bookByOsis(book)
  const bookName = info?.name ?? book
  const remote = await loadRemote(version, book, chapter)
  if (remote && remote.verses.length > 0) {
    return { version, book, bookName, chapter, chapterId: remote.chapterId, verses: remote.verses, source: 'library' }
  }
  if (version === 'WEB') {
    const sample = bundledChapter(book, chapter)
    if (sample) {
      return {
        version,
        book,
        bookName: sample.bookName || bookName,
        chapter,
        chapterId: remote?.chapterId ?? null,
        verses: sample.verses.map((verse) => ({
          ...verse,
          id: null,
          osisRef: `${book}.${chapter}.${verse.number}`,
        })),
        source: 'sample',
      }
    }
  }
  return { version, book, bookName, chapter, chapterId: null, verses: [], source: 'empty' }
}

async function loadRemote(
  version: string,
  book: string,
  chapter: number,
): Promise<{ chapterId: number | null; verses: LoadedVerse[] } | null> {
  const { data, error } = await supabase
    .from('verses')
    .select('id, chapter_id, number, osis_ref, text, chapters!inner(number, books!inner(osis_code, bible_versions!inner(code)))')
    .eq('chapters.books.osis_code', book)
    .eq('chapters.number', chapter)
    .eq('chapters.books.bible_versions.code', version)
    .order('number')
  if (error || !data) return null
  const rows = data as unknown as RemoteVerse[]
  if (!rows.length) return { chapterId: null, verses: [] }
  return {
    chapterId: rows[0]?.chapter_id ?? null,
    verses: rows.map((row) => ({ id: row.id, number: row.number, text: row.text, osisRef: row.osis_ref })),
  }
}

export async function lookupVerseId(version: string, osisRef: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('verses')
    .select('id, chapters!inner(books!inner(bible_versions!inner(code)))')
    .eq('osis_ref', osisRef)
    .eq('chapters.books.bible_versions.code', version)
    .maybeSingle()
  if (error || !data) return null
  return (data as { id: number }).id
}

export async function searchBible(version: VersionCode, query: string): Promise<SearchHit[]> {
  const trimmed = query.trim().slice(0, 80)
  if (trimmed.length < 2) return []
  const local = version === 'WEB' ? searchSample(trimmed).map((hit) => ({ ...hit, source: 'sample' as const })) : []
  const { data, error } = await supabase
    .from('verses')
    .select('number, osis_ref, text, chapters!inner(number, books!inner(osis_code, bible_versions!inner(code)))')
    .eq('chapters.books.bible_versions.code', version)
    .textSearch('fts', trimmed, { type: 'websearch', config: 'english' })
    .limit(30)
  if (error || !data) return local
  const remote: SearchHit[] = (data as unknown as { number: number; osis_ref: string; text: string }[]).map((row) => {
    const [book, chapter] = row.osis_ref.split('.')
    return {
      osisRef: row.osis_ref,
      text: row.text,
      book: book ?? '',
      chapter: Number(chapter ?? 1),
      number: row.number,
      source: 'library',
    }
  })
  if (remote.length) return remote
  return local
}

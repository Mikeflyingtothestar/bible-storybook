import { useQuery } from '@tanstack/react-query'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Platform, Pressable, ScrollView, View } from 'react-native'

import { bookByOsis, neighborChapter } from '@/src/bible/catalog'
import { loadChapter, type LoadedVerse } from '@/src/bible/load'
import { SAMPLE_LABEL } from '@/src/bible/sample'
import { ListenBar } from '@/src/components/ListenBar'
import { AppBar, ThemeSwitcher, Txt } from '@/src/components/ui'
import { VerseSheet } from '@/src/components/VerseSheet'
import { usePrefs } from '@/src/preferences/store'
import { useReadingSession } from '@/src/session/useReadingSession'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function ChapterReader() {
  const params = useLocalSearchParams<{ book: string; chapter: string }>()
  const book = String(params.book ?? 'GEN').toUpperCase()
  const chapter = Number(params.chapter ?? 1)
  const router = useRouter()
  const version = usePrefs((state) => state.versionCode)
  const textScale = usePrefs((state) => state.textScale)
  const setLastPosition = usePrefs((state) => state.setLastPosition)
  const { colors } = useAppTheme()
  const info = bookByOsis(book)
  const query = useQuery({
    queryKey: ['chapter', version, book, chapter],
    queryFn: () => loadChapter(version, book, chapter),
  })
  const [selected, setSelected] = useState<LoadedVerse | null>(null)
  const [activeVerse, setActiveVerse] = useState<number | null>(null)
  const [rate, setRate] = useState(1)
  const [finished, setFinished] = useState(false)
  const loaded = query.data
  const positionKey = `${version}:${book}:${chapter}`
  const [trackedPosition, setTrackedPosition] = useState(positionKey)
  if (trackedPosition !== positionKey) {
    setTrackedPosition(positionKey)
    setFinished(false)
    setActiveVerse(null)
  }

  useEffect(() => {
    setLastPosition({ version, book, chapter })
  }, [version, book, chapter, setLastPosition])

  useReadingSession({ chapterId: loaded?.chapterId ?? null, mode: 'text', completed: finished, enabled: Boolean(loaded) })

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, chapter, version])

  function go(direction: 1 | -1) {
    const next = neighborChapter(book, chapter, direction)
    if (!next) return
    if (direction === 1) setFinished(true)
    router.push(`/bible/${next.osis}/${next.chapter}`)
  }

  const fontSize = Math.round(20 * textScale)

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title={info ? `${info.name} ${chapter}` : 'Reader'} backHref={`/bible/${book}`} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ width: '100%', maxWidth: 680, alignSelf: 'center', paddingHorizontal: 20, gap: 14 }}>
          <ThemeSwitcher />
          {loaded?.source === 'sample' ? (
            <View testID="sample-banner" style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 12 }}>
              <Txt color={colors.muted}>You are reading a sample of the World English Bible. The rest of the library is loading soon. Included now: {SAMPLE_LABEL}.</Txt>
            </View>
          ) : null}
          {loaded?.source === 'empty' ? (
            <View testID="empty-chapter" style={{ gap: 8 }}>
              <Txt size={28} weight={700} serif>
                This chapter’s text is loading soon.
              </Txt>
              <Txt color={colors.muted}>
                {version === 'WEB'
                  ? `Try ${SAMPLE_LABEL} while the full public-domain text is prepared.`
                  : `${version} will appear here after the Bible seed is applied. The bundled sample is in the World English Bible.`}
              </Txt>
              <Link href="/bible/GEN/1">
                <Txt weight={700} color={colors.accent}>
                  Read Genesis 1
                </Txt>
              </Link>
            </View>
          ) : null}
          {loaded?.verses.map((verse) => {
            const active = activeVerse === verse.number
            return (
              <Pressable
                key={verse.number}
                testID={`verse-${verse.number}`}
                accessibilityRole="button"
                accessibilityLabel={`Verse ${verse.number}. ${verse.text}. Open actions`}
                onPress={() => setSelected(verse)}
                style={{
                  borderRadius: 12,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  backgroundColor: active ? colors.surface : 'transparent',
                  borderLeftWidth: active ? 3 : 0,
                  borderLeftColor: colors.accent,
                }}
              >
                <Txt serif size={fontSize}>
                  <Txt serif size={Math.max(12, Math.round(fontSize * 0.62))} weight={700} color={colors.accent}>
                    {verse.number}{' '}
                  </Txt>
                  {verse.text}
                </Txt>
              </Pressable>
            )
          })}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <Pressable accessibilityRole="button" accessibilityLabel="Previous chapter" testID="prev-chapter" onPress={() => go(-1)} style={{ minHeight: 48, justifyContent: 'center' }}>
              <Txt weight={700} color={colors.accent}>
                Previous
              </Txt>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Next chapter" testID="next-chapter" onPress={() => go(1)} style={{ minHeight: 48, justifyContent: 'center' }}>
              <Txt weight={700} color={colors.accent}>
                Next
              </Txt>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {loaded && loaded.verses.length > 0 ? (
        <ListenBar verses={loaded.verses} rate={rate} onRate={setRate} activeVerse={activeVerse} onActiveVerse={setActiveVerse} />
      ) : null}
      <VerseSheet visible={Boolean(selected)} verse={selected} onClose={() => setSelected(null)} version={version} book={book} chapter={chapter} />
    </View>
  )
}

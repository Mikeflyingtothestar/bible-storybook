import { Link } from 'expo-router'
import { Pressable, View } from 'react-native'

import { referenceLabel } from '@/src/bible/sample'
import sample from '@/src/content/sample-web.json'
import { useAuth } from '@/src/auth/AuthProvider'
import { AppBar, Button, Card, Column, Screen, Txt } from '@/src/components/ui'
import { usePrefs } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'

const verses = (sample as { chapters: { book: string; chapter: number; verses: { number: number; text: string }[] }[] }).chapters.flatMap((chapter) =>
  chapter.verses.map((verse) => ({ ...verse, book: chapter.book, chapter: chapter.chapter })),
)
const verseOfTheDay = verses[Math.floor(Date.now() / 86_400_000) % Math.max(verses.length, 1)]

export default function Home() {
  const { colors } = useAppTheme()
  const { user } = useAuth()
  const last = usePrefs((state) => state.lastPosition)
  const verse = verseOfTheDay
  return (
    <Screen>
      <AppBar title="Home" />
      <Column width={840} style={{ gap: 14 }}>
        <Txt size={32} weight={700} serif>
          {user ? 'Welcome back' : 'A quiet place to read'}
        </Txt>
        <Card>
          <Txt weight={800} color={colors.goldText}>
            Verse for today
          </Txt>
          {verse ? (
            <>
              <Txt serif size={22}>
                {verse.text}
              </Txt>
              <Txt color={colors.muted}>{referenceLabel(verse.book, verse.chapter, verse.number)}</Txt>
            </>
          ) : null}
        </Card>
        <Card>
          <Txt weight={800}>Continue</Txt>
          <Txt color={colors.muted}>{last ? referenceLabel(last.book, last.chapter) : 'Genesis 1 is a good place to begin.'}</Txt>
          <Link href={last ? `/bible/${last.book}/${last.chapter}` : '/bible/GEN/1'} asChild>
            <Button label="Open the chapter" />
          </Link>
        </Card>
        <Card>
          <Txt weight={800}>Today’s plan</Txt>
          <Txt color={colors.muted}>Shared reading plans arrive in the next update. For now, choose any chapter that fits the time you have.</Txt>
        </Card>
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/bedtime" asChild>
            <Button label="Bedtime" testID="home-bedtime" />
          </Link>
          <Link href="/me" asChild>
            <Pressable accessibilityRole="link" style={{ minHeight: 48, justifyContent: 'center', paddingHorizontal: 8 }}>
              <Txt weight={700} color={colors.accent}>
                Your reading journey
              </Txt>
            </Pressable>
          </Link>
        </View>
      </Column>
    </Screen>
  )
}

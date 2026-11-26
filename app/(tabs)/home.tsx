import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'

import { AppBar, Button, Card, Column, Screen, Txt } from '@/src/components/ui'
import { gratitudeStreak, streakMessage } from '@/src/journal/streak'
import { prayersFor } from '@/src/prayer/catalog'
import { usePrefs } from '@/src/preferences/store'
import { shareVerseImage } from '@/src/share/verseImage'
import { MOODS, encouragementFor, type Mood } from '@/src/support/mood'
import { dayKey, weekTeaching } from '@/src/teachings/daily'
import { useAppTheme } from '@/src/theme/ThemeProvider'
import { speakText, stopSpeaking } from '@/src/voice/speak'
import { topicsForIntentions } from '@/src/wellness/goals'

export default function TodayScreen() {
  const { colors } = useAppTheme()
  const intentions = usePrefs((state) => state.intentions)
  const today = usePrefs((state) => state.today)
  const openedDays = usePrefs((state) => state.openedDays)
  const liked = usePrefs((state) => state.likedVerse)
  const mood = usePrefs((state) => state.mood)
  const reminder = usePrefs((state) => state.eveningReminder)
  const setReminder = usePrefs((state) => state.setEveningReminder)
  const eveningTime = usePrefs((state) => state.eveningTime)
  const markToday = usePrefs((state) => state.markToday)
  const markOpened = usePrefs((state) => state.markOpened)
  const setLikedVerse = usePrefs((state) => state.setLikedVerse)
  const setMood = usePrefs((state) => state.setMood)
  const day = dayKey(new Date())
  const teaching = weekTeaching(topicsForIntentions(intentions), new Date())
  const prayer = prayersFor('morning')[0]
  const checks = today.day === day ? today : { day, verse: false, teaching: false, prayer: false, journal: false }
  const [shareNote, setShareNote] = useState<string | null>(null)
  const [listening, setListening] = useState(false)
  const support = encouragementFor(mood ?? 'calm')
  const streak = gratitudeStreak(openedDays, day)

  useEffect(() => {
    markOpened(day)
  }, [day, markOpened])

  async function share() {
    markToday(day, 'verse')
    const result = await shareVerseImage(teaching.verse.label, teaching.verse.text)
    setShareNote(result === 'unavailable' ? 'The picture share is ready in the browser.' : 'Verse card ready to share.')
  }

  function listen() {
    markToday(day, 'teaching')
    if (listening) {
      stopSpeaking()
      setListening(false)
      return
    }
    setListening(true)
    speakText(teaching.listenText)
  }

  return (
    <Screen testID="today">
      <AppBar title="Today" />
      <Column width={720} style={{ gap: 16 }}>
        <Txt size={34} weight={700} serif>
          Today
        </Txt>
        <Txt color={colors.muted}>{streakMessage(streak)}</Txt>
        <Card>
          <Txt weight={700} color={colors.accent}>
            Daily verse
          </Txt>
          <Txt serif size={24}>
            {teaching.verse.text}
          </Txt>
          <Txt color={colors.muted}>{teaching.verse.label}</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Pressable accessibilityRole="button" accessibilityLabel="Like this verse" onPress={() => { markToday(day, 'verse'); setLikedVerse(liked === teaching.verse.osisRef ? null : teaching.verse.osisRef) }} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}>
              <Txt weight={700} color={colors.accent}>{liked === teaching.verse.osisRef ? 'Liked' : 'Like'}</Txt>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Share verse as an image" onPress={() => void share()} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}>
              <Txt weight={700} color={colors.accent}>Share image</Txt>
            </Pressable>
          </View>
          {shareNote ? <Txt color={colors.muted}>{shareNote}</Txt> : null}
        </Card>
        <Card>
          <Txt weight={700}>Day {teaching.dayOfWeek} of 7 · {teaching.topic}</Txt>
          <Txt>{teaching.reflection}</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Button label={checks.teaching ? 'Read' : 'Mark as read'} onPress={() => markToday(day, 'teaching')} />
            <Button label={listening ? 'Stop' : 'Listen'} variant="quiet" onPress={listen} />
          </View>
        </Card>
        <Card>
          <Txt weight={700}>Today’s prayer · about 2 min</Txt>
          <Txt>{prayer?.body}</Txt>
          <Txt color={colors.muted}>{prayer?.verse.label}</Txt>
          <Button label={checks.prayer ? 'Prayer kept' : 'I prayed'} onPress={() => markToday(day, 'prayer')} />
          <Link href="/pray" asChild>
            <Button label="Morning and night prayers" variant="quiet" />
          </Link>
        </Card>
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: checks.journal }} onPress={() => markToday(day, 'journal')} style={{ minHeight: 48, justifyContent: 'center' }}>
          <Txt weight={700} color={checks.journal ? colors.accent : colors.text}>
            {checks.journal ? 'Journal noted' : 'Optional · add a journal line'}
          </Txt>
        </Pressable>
        <Link href="/journal" asChild>
          <Button label="Open journal" variant="quiet" />
        </Link>
        <Card>
          <Txt weight={700}>How are you arriving?</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {MOODS.map((item) => (
              <Pressable key={item} accessibilityRole="button" accessibilityLabel={item} onPress={() => setMood(item as Mood)} style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 999, justifyContent: 'center', backgroundColor: mood === item ? colors.accent : colors.surface }}>
                <Txt weight={700} color={mood === item ? colors.onAccent : colors.text}>{item}</Txt>
              </Pressable>
            ))}
          </View>
          <Txt color={colors.muted}>{support.text} {support.verse.label}</Txt>
        </Card>
        <Card>
          <Txt weight={700}>One evening reminder</Txt>
          <Txt color={colors.muted}>Optional, around {eveningTime}. Turning it off changes nothing about your streak.</Txt>
          <Pressable accessibilityRole="switch" accessibilityState={{ checked: reminder }} onPress={() => setReminder(!reminder)} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Txt weight={700} color={colors.accent}>{reminder ? 'Reminder on' : 'Remind me this evening'}</Txt>
          </Pressable>
        </Card>
        <Link href="/bedtime" asChild>
          <Button label="Wind down" testID="home-bedtime" />
        </Link>
      </Column>
    </Screen>
  )
}

import Feather from '@expo/vector-icons/Feather'
import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, useWindowDimensions, View } from 'react-native'

import { NATURE } from '@/src/art/images'
import { AppBar, Button, Card, Column, Screen, Txt } from '@/src/components/ui'
import { Photo } from '@/src/components/Photo'
import { ProgressRing } from '@/src/components/ProgressRing'
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
  const preferred = usePrefs((state) => state.preferredTime)
  const { width } = useWindowDimensions()
  const wide = width >= 1100
  const day = dayKey(new Date())
  const teaching = weekTeaching(topicsForIntentions(intentions), new Date())
  const prayer = prayersFor(preferred === 'evening' ? 'evening' : 'morning')[0]
  const greeting = preferred === 'evening' ? 'Good evening' : 'Good morning'
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
      <Column width={wide ? 1100 : 720} style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, gap: 6 }}>
            <Txt size={34} weight={700} serif>{greeting}</Txt>
            <Txt color={colors.muted}>{streakMessage(streak)}</Txt>
          </View>
          <ProgressRing done={Number(checks.verse) + Number(checks.teaching) + Number(checks.prayer)} total={3} />
        </View>
        <View style={{ flexDirection: wide ? 'row' : 'column', gap: 16, alignItems: 'flex-start' }}>
        <View style={{ flex: 1, minWidth: 0, width: wide ? undefined : '100%', gap: 16 }}>
        <View style={{ borderRadius: 28, overflow: 'hidden', position: 'relative', minHeight: 280 }}>
          <Photo source={NATURE.sunrise} alt="Sunrise behind the daily verse" height={280} radius={28} />
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, padding: 20, justifyContent: 'flex-end', gap: 12, backgroundColor: 'rgba(12,16,14,0.55)' }}>
            <Txt weight={700} color="#F7F4EE">Daily verse</Txt>
            <Txt serif size={teaching.verse.text.length > 110 ? 18 : 22} color="#F7F4EE" style={{ lineHeight: teaching.verse.text.length > 110 ? 26 : 30 }}>
              {teaching.verse.text}
            </Txt>
            <Txt color="#F7F4EE">{teaching.verse.label}</Txt>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable accessibilityRole="button" accessibilityLabel="Like this verse" onPress={() => { markToday(day, 'verse'); setLikedVerse(liked === teaching.verse.osisRef ? null : teaching.verse.osisRef) }} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(247,244,238,0.94)', alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="heart" size={18} color={liked === teaching.verse.osisRef ? '#0E6B56' : '#1C1917'} />
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Share verse as an image" onPress={() => void share()} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(247,244,238,0.94)', alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="share" size={18} color="#1C1917" />
              </Pressable>
            </View>
          </View>
        </View>
        {shareNote ? <Txt color={colors.muted}>{shareNote}</Txt> : null}
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
        </View>
        <View style={{ width: wide ? 300 : '100%', gap: 16 }}>
        <Card>
          <Txt weight={700}>{streakMessage(streak)}</Txt>
        </Card>
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/stories/creation" asChild>
            <Pressable accessibilityRole="link" style={{ flexGrow: 1, flexBasis: 220, minWidth: 0, minHeight: 140 }}>
              <Photo source={NATURE.leaves} alt="Leaves for the creation story" height={140} />
            </Pressable>
          </Link>
          <Link href="/bedtime" asChild>
            <Pressable accessibilityRole="link" testID="home-bedtime" style={{ flexGrow: 1, flexBasis: 220, minWidth: 0, minHeight: 140 }}>
              <Photo source={NATURE.water} alt="Still water for sleep" height={140} />
            </Pressable>
          </Link>
        </View>
        </View>
        </View>
      </Column>
    </Screen>
  )
}

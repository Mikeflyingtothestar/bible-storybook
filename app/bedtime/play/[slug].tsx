import { useKeepAwake } from 'expo-keep-awake'
import { Link, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { bundledChapter } from '@/src/bible/sample'
import { SLEEP_TIMER_CHOICES, fadeAmount, formatClock } from '@/src/bedtime/timer'
import { fontSans, fontSerif } from '@/src/components/ui'
import { useReadingSession } from '@/src/session/useReadingSession'
import { bedtime } from '@/src/theme/tokens'
import { DeviceVoiceProvider } from '@/src/voice/device'
import { versesToSegments } from '@/src/voice/segments'

const READINGS: Record<string, { title: string; book: string; chapter: number; start?: number; end?: number }> = {
  'psalm-23': { title: 'Psalm 23', book: 'PSA', chapter: 23 },
  'psalm-121': { title: 'Psalm 121', book: 'PSA', chapter: 121 },
  creation: { title: 'Creation', book: 'GEN', chapter: 1 },
  'do-not-worry': { title: 'Do not worry', book: 'MAT', chapter: 6, start: 25, end: 34 },
}

export default function BedtimePlayer() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const reading = READINGS[String(slug)] ?? READINGS['psalm-23']
  const chapter = bundledChapter(reading.book, reading.chapter)
  const verses = (chapter?.verses ?? []).filter((verse) => {
    if (reading.start && verse.number < reading.start) return false
    if (reading.end && verse.number > reading.end) return false
    return true
  })
  const provider = useMemo(() => new DeviceVoiceProvider(), [])
  const [minutes, setMinutes] = useState(15)
  const [playing, setPlaying] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(15 * 60_000)
  const [stoppedBy, setStoppedBy] = useState<'timer' | 'story' | 'user' | ''>('')

  useKeepAwake()
  useReadingSession({ chapterId: null, mode: 'bedtime', completed: stoppedBy === 'story', enabled: playing || stoppedBy !== '' })

  useEffect(() => () => provider.stop(), [provider])

  useEffect(() => {
    if (!playing || !endsAt) return
    const id = setInterval(() => {
      const left = Math.max(0, endsAt - Date.now())
      setRemaining(left)
      if (left <= 0) {
        provider.stop()
        setPlaying(false)
        setStoppedBy('timer')
      }
    }, 250)
    return () => clearInterval(id)
  }, [playing, endsAt, provider])

  function start() {
    const segments = versesToSegments(verses)
    setStoppedBy('')
    setEndsAt(Date.now() + minutes * 60_000)
    setRemaining(minutes * 60_000)
    setPlaying(true)
    provider.speak(segments, {
      rate: 0.85,
      onSegmentStart: (_index, segment) => setActive(Number(segment.id)),
      onEnd: (reason) => {
        setPlaying(false)
        if (reason === 'finished') setStoppedBy('story')
      },
    })
  }

  function stop(reason: 'user' | 'timer') {
    provider.stop()
    setPlaying(false)
    setStoppedBy(reason)
  }

  const fade = fadeAmount(remaining)
  return (
    <View style={{ flex: 1, backgroundColor: bedtime.bg, opacity: playing ? fade : 1 }} testID="bedtime-player">
      <View style={{ flex: 1, padding: 28, gap: 16, maxWidth: 720, alignSelf: 'center', width: '100%' }}>
        <Text style={{ color: bedtime.text, fontFamily: fontSerif(700), fontSize: 34 }}>{reading.title}</Text>
        <Text testID="speaking-state" style={{ color: bedtime.muted, fontFamily: fontSans(700) }}>
          {playing ? 'Reading aloud' : stoppedBy === 'timer' ? 'Faded out' : stoppedBy === 'story' ? 'Finished' : 'Ready'}
        </Text>
        <Text style={{ color: bedtime.muted, fontFamily: fontSans(700) }} testID="timer-label">
          {playing ? formatClock(remaining) : `${minutes} minutes`}
        </Text>
        {!playing ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {SLEEP_TIMER_CHOICES.map((choice) => (
              <Pressable key={choice} accessibilityRole="button" accessibilityLabel={`${choice} minute timer`} testID={`timer-${choice}`} onPress={() => setMinutes(choice)} style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 999, backgroundColor: minutes === choice ? '#3A2E1C' : bedtime.surface, justifyContent: 'center' }}>
                <Text style={{ color: bedtime.text, fontFamily: fontSans(700) }}>{choice} min</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Stop bedtime reading' : 'Start bedtime reading'} testID={playing ? 'bedtime-stop' : 'bedtime-start'} onPress={() => (playing ? stop('user') : start())} style={{ minHeight: 52, borderRadius: 16, backgroundColor: '#3A2E1C', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: bedtime.text, fontFamily: fontSans(800), fontSize: 18 }}>{playing ? 'Stop' : 'Begin'}</Text>
        </Pressable>
        {stoppedBy === 'timer' ? <Text style={{ color: bedtime.text, fontFamily: fontSans() }}>Time to rest. The reading has faded out.</Text> : null}
        {stoppedBy === 'story' ? <Text style={{ color: bedtime.text, fontFamily: fontSans() }}>The reading is finished. Sweet dreams.</Text> : null}
        {verses.map((verse) => (
          <Text key={verse.number} style={{ color: active === verse.number ? '#F3E0B8' : bedtime.text, fontFamily: fontSerif(), fontSize: active === verse.number ? 26 : 22, lineHeight: 38 }}>
            {verse.text}
          </Text>
        ))}
        <Link href="/bedtime">
          <Text style={{ color: bedtime.muted, fontFamily: fontSans(700), paddingVertical: 16 }}>Choose another reading</Text>
        </Link>
      </View>
    </View>
  )
}

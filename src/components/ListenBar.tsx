import { useEffect, useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { useEntitlement } from '../entitlement/useEntitlement'
import { useRouter } from 'expo-router'
import { versesToSegments } from '../voice/segments'
import { DeviceVoiceProvider } from '../voice/device'
import { fontSans } from './ui'
import { useAppTheme } from '../theme/ThemeProvider'

const RATES = [0.75, 1, 1.25, 1.5]

export function ListenBar({
  verses,
  rate,
  onRate,
  activeVerse,
  onActiveVerse,
  testID,
}: {
  verses: { number: number; text: string }[]
  rate: number
  onRate: (rate: number) => void
  activeVerse: number | null
  onActiveVerse: (verse: number | null) => void
  testID?: string
}) {
  const { colors } = useAppTheme()
  const { voices } = useEntitlement()
  const router = useRouter()
  const [voiceId, setVoiceId] = useState('device-default')
  const [speaking, setSpeaking] = useState(false)
  const provider = useMemo(() => new DeviceVoiceProvider(), [])
  const segments = useMemo(() => versesToSegments(verses), [verses])

  useEffect(() => () => provider.stop(), [provider])

  const selected = voices.find((voice) => voice.id === voiceId) ?? voices[0]

  function play() {
    if (selected?.locked) {
      router.push('/paywall')
      return
    }
    provider.speak(segments, {
      voiceId: selected?.id,
      rate,
      onSegmentStart: (_index, segment) => onActiveVerse(Number(segment.id)),
      onEnd: () => {
        setSpeaking(false)
        onActiveVerse(null)
      },
    })
    setSpeaking(true)
  }

  function stop() {
    provider.stop()
    setSpeaking(false)
    onActiveVerse(null)
  }

  return (
    <View
      testID={testID}
      style={{
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={speaking ? 'Pause reading' : 'Listen to this chapter'}
          testID="listen-toggle"
          onPress={speaking ? stop : play}
          style={{ minHeight: 44, paddingHorizontal: 16, borderRadius: 999, backgroundColor: colors.accent, justifyContent: 'center' }}
        >
          <Text style={{ color: colors.onAccent, fontFamily: fontSans(700) }}>{speaking ? 'Stop' : 'Listen'}</Text>
        </Pressable>
        <Text style={{ color: colors.muted, fontFamily: fontSans(600) }}>{activeVerse ? `Verse ${activeVerse}` : selected?.name ?? 'Device voice'}</Text>
        {RATES.map((value) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityLabel={`Speed ${value}`}
            onPress={() => onRate(value)}
            style={{
              minHeight: 44,
              paddingHorizontal: 10,
              borderRadius: 999,
              justifyContent: 'center',
              backgroundColor: rate === value ? colors.accent : 'transparent',
            }}
          >
            <Text style={{ color: rate === value ? colors.onAccent : colors.text, fontFamily: fontSans(700) }}>{value}×</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {voices.map((voice) => (
          <Pressable
            key={voice.id}
            accessibilityRole="button"
            accessibilityLabel={voice.locked ? `${voice.name}, locked` : voice.name}
            onPress={() => {
              if (voice.locked) router.push('/paywall')
              else setVoiceId(voice.id)
            }}
            style={{
              minHeight: 36,
              paddingHorizontal: 10,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: voice.id === selected?.id ? colors.accent : colors.border,
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: colors.text, fontFamily: fontSans(600), fontSize: 13 }}>
              {voice.locked ? 'Locked · ' : ''}
              {voice.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

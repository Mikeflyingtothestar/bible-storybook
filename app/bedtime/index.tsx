import Feather from '@expo/vector-icons/Feather'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { NATURE } from '@/src/art/images'
import { Photo } from '@/src/components/Photo'
import { fontSans, fontSerif } from '@/src/components/ui'
import { NIGHT_TIMERS } from '@/src/bedtime/timer'
import { bedtime } from '@/src/theme/tokens'

const READINGS = [
  { slug: 'psalm-23', title: 'Psalm 23', detail: 'Still water', minutes: 5, image: NATURE.water },
  { slug: 'psalm-121', title: 'Psalm 121', detail: 'A keeper who stays awake', minutes: 4, image: NATURE.sunrise },
  { slug: 'do-not-worry', title: 'Do not worry', detail: 'Matthew 6', minutes: 6, image: NATURE.leaves },
  { slug: 'creation', title: 'Creation', detail: 'Light, then rest', minutes: 8, image: NATURE.sunrise },
]

export default function BedtimeHome() {
  const [selected, setSelected] = useState(READINGS[0]!)
  const [minutes, setMinutes] = useState<number>(15)
  return (
    <View style={{ flex: 1, backgroundColor: bedtime.bg }} testID="sleep">
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, minHeight: 56 }}>
        <Link href="/home" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel="Back to Today" style={{ minWidth: 44, minHeight: 44, justifyContent: 'center' }}>
            <Feather name="arrow-left" size={22} color={bedtime.text} />
          </Pressable>
        </Link>
        <Text style={{ color: bedtime.text, fontFamily: fontSans(700), fontSize: 18 }}>Sleep</Text>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 20, gap: 12 }}>
        <Photo source={NATURE.water} alt="Still water at night" height={160} />
        <Text style={{ color: bedtime.muted, fontFamily: fontSans(), fontSize: 16, lineHeight: 24 }}>
          One free wind-down each night. Choose a reading, set a timer, and let it fade.
        </Text>
        {READINGS.map((reading) => (
          <Pressable key={reading.slug} accessibilityRole="button" accessibilityLabel={reading.title} onPress={() => setSelected(reading)} style={{ minHeight: 76, borderRadius: 16, padding: 10, backgroundColor: selected.slug === reading.slug ? '#241C14' : bedtime.surface, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden' }}>
              <Photo source={reading.image} alt="" height={64} radius={12} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: bedtime.text, fontFamily: fontSans(700), fontSize: 17 }}>{reading.title}</Text>
              <Text style={{ color: bedtime.muted, fontFamily: fontSans() }}>{reading.minutes} min · {reading.detail}</Text>
            </View>
            <Feather name="play" size={18} color={bedtime.text} />
          </Pressable>
        ))}
      </View>
      <View style={{ padding: 16, gap: 10, backgroundColor: bedtime.surface }}>
        <Text style={{ color: bedtime.text, fontFamily: fontSerif(700), fontSize: 18 }}>{selected.title}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {NIGHT_TIMERS.map((choice) => (
            <Pressable key={choice} accessibilityRole="button" accessibilityLabel={`${choice} minute timer`} onPress={() => setMinutes(choice)} style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 999, justifyContent: 'center', backgroundColor: minutes === choice ? '#3A2E1C' : bedtime.bg }}>
              <Text style={{ color: bedtime.text, fontFamily: fontSans(700) }}>{choice} min</Text>
            </Pressable>
          ))}
        </View>
        <Link href={`/bedtime/play/${selected.slug}?minutes=${minutes}`} asChild>
          <Pressable accessibilityRole="link" accessibilityLabel="Play sleep story" style={{ minHeight: 52, borderRadius: 16, backgroundColor: '#3A2E1C', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}>
            <Feather name="play" size={18} color={bedtime.text} />
            <Text style={{ color: bedtime.text, fontFamily: fontSans(700), fontSize: 18 }}>Play · {minutes} min</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  )
}

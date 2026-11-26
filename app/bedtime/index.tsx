import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

import { fontSans, fontSerif } from '@/src/components/ui'
import { bedtime } from '@/src/theme/tokens'

const READINGS = [
  { slug: 'psalm-23', title: 'Psalm 23', detail: 'The shepherd psalm' },
  { slug: 'psalm-121', title: 'Psalm 121', detail: 'I lift up my eyes' },
  { slug: 'do-not-worry', title: 'Do not worry', detail: 'Matthew 6:25–34' },
  { slug: 'creation', title: 'Creation', detail: 'Genesis 1' },
]

export default function BedtimeHome() {
  return (
    <View style={{ flex: 1, backgroundColor: bedtime.bg, padding: 24, gap: 16 }}>
      <Text style={{ color: bedtime.text, fontFamily: fontSerif(700), fontSize: 36 }}>Bedtime</Text>
      <Text style={{ color: bedtime.muted, fontFamily: fontSans(), fontSize: 16, lineHeight: 24 }}>
        One free wind-down each night. Psalm 23 is the short narrated sleep story. Set 2, 5, 10 or 15 minutes, then let it fade.
      </Text>
      {READINGS.map((reading) => (
        <Link key={reading.slug} href={`/bedtime/play/${reading.slug}`} asChild>
          <Pressable accessibilityRole="link" accessibilityLabel={reading.title} style={{ minHeight: 64, borderRadius: 16, padding: 16, backgroundColor: bedtime.surface, justifyContent: 'center' }}>
            <Text style={{ color: bedtime.text, fontFamily: fontSans(700), fontSize: 18 }}>{reading.title}</Text>
            <Text style={{ color: bedtime.muted, fontFamily: fontSans() }}>{reading.detail}</Text>
          </Pressable>
        </Link>
      ))}
      <Link href="/home">
        <Text style={{ color: bedtime.text, fontFamily: fontSans(700), paddingVertical: 12 }}>Leave bedtime</Text>
      </Link>
    </View>
  )
}

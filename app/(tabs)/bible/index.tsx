import { Link } from 'expo-router'
import { Pressable, View } from 'react-native'

import { BOOKS, VERSIONS, type VersionCode } from '@/src/bible/catalog'
import { AppBar, Column, Screen, Txt } from '@/src/components/ui'
import { usePrefs } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function BibleIndex() {
  const version = usePrefs((state) => state.versionCode)
  const setVersion = usePrefs((state) => state.setVersionCode)
  const { colors } = useAppTheme()
  return (
    <Screen>
      <AppBar title="Bible" />
      <Column width={840} style={{ gap: 18 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {VERSIONS.map((item) => {
            const selected = item.code === version
            return (
              <Pressable
                key={item.code}
                accessibilityRole="button"
                accessibilityLabel={item.name}
                onPress={() => setVersion(item.code as VersionCode)}
                style={{ minHeight: 44, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center', backgroundColor: selected ? colors.accent : colors.surface }}
              >
                <Txt weight={800} color={selected ? colors.onAccent : colors.text}>
                  {item.code}
                </Txt>
              </Pressable>
            )
          })}
          <Link href="/bible/search" asChild>
            <Pressable accessibilityRole="link" accessibilityLabel="Search the Bible" testID="open-search" style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}>
              <Txt weight={700} color={colors.accent}>
                Search
              </Txt>
            </Pressable>
          </Link>
        </View>
        {(['OT', 'NT'] as const).map((testament) => (
          <View key={testament} style={{ gap: 8 }}>
            <Txt weight={800} color={colors.muted}>
              {testament === 'OT' ? 'Old Testament' : 'New Testament'}
            </Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {BOOKS.filter((book) => book.testament === testament).map((book) => (
                <Link key={book.osis} href={`/bible/${book.osis}`} asChild>
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel={book.name}
                    style={{ minHeight: 48, minWidth: 140, paddingHorizontal: 12, borderRadius: 14, backgroundColor: colors.surface, justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                  >
                    <Txt weight={700}>{book.name}</Txt>
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>
        ))}
      </Column>
    </Screen>
  )
}

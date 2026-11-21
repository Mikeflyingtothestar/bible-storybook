import { Link, useLocalSearchParams } from 'expo-router'
import { Pressable, View } from 'react-native'

import { bookByOsis } from '@/src/bible/catalog'
import { AppBar, Column, Screen, Txt } from '@/src/components/ui'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function ChapterGrid() {
  const { book: raw } = useLocalSearchParams<{ book: string }>()
  const book = bookByOsis(String(raw ?? ''))
  const { colors } = useAppTheme()
  if (!book) {
    return (
      <Screen>
        <AppBar title="Bible" backHref="/bible" />
        <Column>
          <Txt>That book is not in the sixty-six.</Txt>
        </Column>
      </Screen>
    )
  }
  return (
    <Screen>
      <AppBar title={book.name} backHref="/bible" />
      <Column width={840} style={{ gap: 12 }}>
        <Txt color={colors.muted}>{book.chapters} chapters</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {Array.from({ length: book.chapters }, (_, index) => index + 1).map((chapter) => (
            <Link key={chapter} href={`/bible/${book.osis}/${chapter}`} asChild>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={`${book.name} ${chapter}`}
                style={{ width: 56, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
              >
                <Txt weight={700}>{chapter}</Txt>
              </Pressable>
            </Link>
          ))}
        </View>
      </Column>
    </Screen>
  )
}

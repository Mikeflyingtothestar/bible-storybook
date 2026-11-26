import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { searchBible, type SearchHit } from '@/src/bible/load'
import { referenceLabel } from '@/src/bible/sample'
import { AppBar, Column, Field, Screen, Txt } from '@/src/components/ui'
import { usePrefs } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function SearchScreen() {
  const version = usePrefs((state) => state.versionCode)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [note, setNote] = useState<string | null>(null)
  const router = useRouter()
  const { colors } = useAppTheme()

  return (
    <Screen>
      <AppBar title="Search" backHref="/bible" />
      <Column width={720} style={{ gap: 12 }}>
        <Field
          label={`Search ${version}`}
          value={query}
          onChangeText={setQuery}
          testID="search-input"
          placeholder="shepherd, light, beginning"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search verses"
          testID="search-submit"
          onPress={() => {
            void searchBible(version, query)
              .then((rows) => {
                setHits(rows)
                setNote(rows.length ? null : 'No verses matched. Try a word from the chapter you were reading.')
              })
              .catch(() => {
                setHits([])
                setNote('Search needs a connection. Try again when you are back online.')
              })
          }}
          style={{ minHeight: 48, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}
        >
          <Txt weight={800} color={colors.onAccent}>
            Search
          </Txt>
        </Pressable>
        {note ? <Txt color={colors.muted}>{note}</Txt> : null}
        <View style={{ gap: 10 }}>
          {hits.map((hit) => (
            <Pressable
              key={`${hit.source}-${hit.osisRef}`}
              accessibilityRole="button"
              onPress={() => router.push(`/bible/${hit.book}/${hit.chapter}`)}
              style={{ minHeight: 44, padding: 12, borderRadius: 14, backgroundColor: colors.surface }}
            >
              <Txt weight={800} color={colors.accent}>
                {referenceLabel(hit.book, hit.chapter, hit.number)}
              </Txt>
              <Txt>{hit.text}</Txt>
            </Pressable>
          ))}
        </View>
      </Column>
    </Screen>
  )
}

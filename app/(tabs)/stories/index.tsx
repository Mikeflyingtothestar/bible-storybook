import { Link } from 'expo-router'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { AppBar, Column, Screen, Txt } from '@/src/components/ui'
import { STORIES } from '@/src/stories/catalog'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function StoriesScreen() {
  const { colors } = useAppTheme()
  const [filter, setFilter] = useState<'all' | 'kids' | 'bedtime' | 'OT' | 'NT'>('all')
  const rows = STORIES.filter((story) => {
    if (filter === 'kids') return story.kids
    if (filter === 'bedtime') return story.bedtime
    if (filter === 'OT' || filter === 'NT') return story.testament === filter
    return true
  })
  return (
    <Screen>
      <AppBar title="Stories" />
      <Column width={840} style={{ gap: 12 }}>
        <Txt color={colors.muted}>Narration comes first. Open a story and listen. Pictures can wait.</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {(['all', 'kids', 'bedtime', 'OT', 'NT'] as const).map((item) => (
            <Pressable key={item} accessibilityRole="button" onPress={() => setFilter(item)} style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 999, justifyContent: 'center', backgroundColor: filter === item ? colors.accent : colors.surface }}>
              <Txt weight={700} color={filter === item ? colors.onAccent : colors.text}>
                {item === 'all' ? 'All' : item === 'kids' ? 'Kids' : item === 'bedtime' ? 'Bedtime' : item}
              </Txt>
            </Pressable>
          ))}
        </View>
        {rows.map((story) => (
          <Link key={story.slug} href={`/stories/${story.slug}`} asChild>
            <Pressable accessibilityRole="link" accessibilityLabel={story.title} style={{ padding: 22, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderLeftWidth: 3, borderLeftColor: colors.accent, gap: 6 }}>
              <Txt size={22} weight={700} serif>{story.title}</Txt>
              <Txt weight={700} color={colors.accent}>Listen</Txt>
              <Txt color={colors.muted}>{story.summary}</Txt>
            </Pressable>
          </Link>
        ))}
      </Column>
    </Screen>
  )
}

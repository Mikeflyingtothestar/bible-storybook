import { Link, useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

import { AppBar, Button, Column, Screen, Txt } from '@/src/components/ui'
import { speakText } from '@/src/voice/speak'
import { useEntitlement } from '@/src/entitlement/useEntitlement'
import { STORIES } from '@/src/stories/catalog'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function StoryDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const story = STORIES.find((item) => item.slug === slug)
  const { colors } = useAppTheme()
  const { mediaGate } = useEntitlement()
  if (!story) {
    return (
      <Screen>
        <AppBar title="Stories" backHref="/stories" />
        <Column>
          <Txt>That story is not in this collection.</Txt>
        </Column>
      </Screen>
    )
  }
  const video = mediaGate('video_mode', 'premium')
  return (
    <Screen>
      <AppBar title={story.title} backHref="/stories" />
      <Column width={720} style={{ gap: 14 }}>
        <Txt color={colors.muted}>{story.summary}</Txt>
        <Button label="Listen to the story" onPress={() => speakText(story.scenes.map((scene) => scene.narration).join(' '))} />
        <Txt color={colors.muted}>
          Pictures are still being prepared. {video === 'flag-off' ? 'Video stories are coming soon.' : video === 'upgrade' ? 'Video is a Premium feature.' : 'Video is available for this tier.'}
        </Txt>
        {video === 'upgrade' ? (
          <Link href="/paywall">
            <Txt weight={700} color={colors.accent}>
              See plans
            </Txt>
          </Link>
        ) : null}
        {story.scenes.map((scene, index) => (
          <View key={scene.verseRef + index} style={{ gap: 6, padding: 16, borderRadius: 16, backgroundColor: colors.surface }}>
            <View style={{ height: 120, borderRadius: 12, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Txt color={colors.muted}>Illustration coming soon</Txt>
            </View>
            <Txt weight={800}>{scene.caption}</Txt>
            <Txt serif>{scene.narration}</Txt>
            <Txt size={13} color={colors.muted}>
              {scene.verseRef}
            </Txt>
          </View>
        ))}
      </Column>
    </Screen>
  )
}

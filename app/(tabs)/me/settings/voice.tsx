import { useRouter } from 'expo-router'
import { Pressable, View } from 'react-native'

import { AppBar, Column, Screen, Txt } from '@/src/components/ui'
import { useEntitlement } from '@/src/entitlement/useEntitlement'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function VoiceSettings() {
  const { voices } = useEntitlement()
  const { colors } = useAppTheme()
  const router = useRouter()
  return (
    <Screen>
      <AppBar title="Voice" backHref="/me/settings" />
      <Column width={640} style={{ gap: 10 }}>
        <Txt color={colors.muted}>Device voices are free. Premium voices stay locked until the premium_voices flag is on and your plan includes them.</Txt>
        {voices.map((voice) => (
          <Pressable
            key={voice.id}
            accessibilityRole="button"
            accessibilityLabel={voice.locked ? `${voice.name} locked` : voice.name}
            onPress={() => {
              if (voice.locked) router.push('/paywall')
            }}
            style={{ minHeight: 52, borderRadius: 14, paddingHorizontal: 14, justifyContent: 'center', backgroundColor: colors.surface }}
          >
            <Txt weight={700}>
              {voice.locked ? 'Locked · ' : ''}
              {voice.name}
            </Txt>
          </Pressable>
        ))}
        <View />
      </Column>
    </Screen>
  )
}

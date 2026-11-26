import { Pressable, View } from 'react-native'

import { NATURE } from '@/src/art/images'
import { OnboardingStep } from '@/src/components/OnboardingStep'
import { Photo } from '@/src/components/Photo'
import { Txt } from '@/src/components/ui'
import { usePrefs } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'
import { INTENTIONS } from '@/src/wellness/goals'

export default function Intentions() {
  const chosen = usePrefs((state) => state.intentions)
  const toggle = usePrefs((state) => state.toggleIntention)
  const { colors } = useAppTheme()
  return (
    <OnboardingStep step="1 of 4" title="What would help this week?" body="Today follows what you choose. You can change it any time." next="/focus-time">
      <Photo source={NATURE.sunrise} alt="A quiet sunrise" height={140} />
      <View style={{ gap: 8 }}>
        {INTENTIONS.map((item) => {
          const selected = chosen.includes(item.id)
          return (
            <Pressable key={item.id} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} onPress={() => toggle(item.id)} style={{ minHeight: 48, borderRadius: 14, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: selected ? colors.accent : colors.surface }}>
              <Txt weight={700} color={selected ? colors.onAccent : colors.text}>{item.label}</Txt>
            </Pressable>
          )
        })}
      </View>
    </OnboardingStep>
  )
}

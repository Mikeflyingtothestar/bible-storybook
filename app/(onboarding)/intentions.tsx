import { Pressable, View } from 'react-native'

import { OnboardingStep } from '@/src/components/OnboardingStep'
import { Txt } from '@/src/components/ui'
import { usePrefs } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'
import { INTENTIONS } from '@/src/wellness/goals'

export default function Intentions() {
  const chosen = usePrefs((state) => state.intentions)
  const toggle = usePrefs((state) => state.toggleIntention)
  const { colors } = useAppTheme()
  return (
    <OnboardingStep step="4 of 5" title="What would help this week?" body="Today will follow what you pick. You can change it later." next="/profile">
      <View style={{ gap: 8 }}>
        {INTENTIONS.map((item) => {
          const selected = chosen.includes(item.id)
          return (
            <Pressable
              key={item.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              onPress={() => toggle(item.id)}
              style={{ minHeight: 48, borderRadius: 14, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: selected ? colors.accent : colors.surface }}
            >
              <Txt weight={700} color={selected ? colors.onAccent : colors.text}>
                {item.label}
              </Txt>
            </Pressable>
          )
        })}
      </View>
    </OnboardingStep>
  )
}
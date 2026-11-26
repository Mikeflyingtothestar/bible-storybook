import { Pressable, View } from 'react-native'

import { NATURE } from '@/src/art/images'
import { OnboardingStep } from '@/src/components/OnboardingStep'
import { Photo } from '@/src/components/Photo'
import { Txt } from '@/src/components/ui'
import { usePrefs } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'

const TIMES = [
  { id: 'morning' as const, label: 'Morning' },
  { id: 'evening' as const, label: 'Evening' },
  { id: 'flexible' as const, label: 'Whenever I can' },
]

export default function FocusTime() {
  const preferred = usePrefs((state) => state.preferredTime)
  const setPreferred = usePrefs((state) => state.setPreferredTime)
  const { colors } = useAppTheme()
  return (
    <OnboardingStep step="2 of 4" title="When do you like to pause?" body="Today will open with a greeting that matches this." next="/reminder">
      <Photo source={NATURE.water} alt="Still water" height={140} />
      <View style={{ gap: 8 }}>
        {TIMES.map((item) => {
          const selected = preferred === item.id
          return (
            <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ selected }} onPress={() => setPreferred(item.id)} style={{ minHeight: 48, borderRadius: 14, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: selected ? colors.accent : colors.surface }}>
              <Txt weight={700} color={selected ? colors.onAccent : colors.text}>{item.label}</Txt>
            </Pressable>
          )
        })}
      </View>
    </OnboardingStep>
  )
}

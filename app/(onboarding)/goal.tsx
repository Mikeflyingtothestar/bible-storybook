import { Pressable, View } from 'react-native'

import { OnboardingStep } from '@/src/components/OnboardingStep'
import { Txt } from '@/src/components/ui'
import { usePrefs, type DailyGoal } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'

const GOALS: DailyGoal[] = [5, 10, 15]

export default function ChooseGoal() {
  const goal = usePrefs((state) => state.dailyGoalMin)
  const setGoal = usePrefs((state) => state.setDailyGoalMin)
  const { colors } = useAppTheme()
  return (
    <OnboardingStep
      step="3 of 4"
      title="A gentle daily aim"
      body="This stays on this device. It is a reminder, not a target you can fail."
      next="/profile"
    >
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {GOALS.map((minutes) => {
          const selected = goal === minutes
          return (
            <Pressable
              key={minutes}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setGoal(minutes)}
              style={{
                flex: 1,
                minHeight: 64,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selected ? colors.accent : colors.surface,
              }}
            >
              <Txt weight={800} color={selected ? colors.onAccent : colors.text}>
                {minutes} min
              </Txt>
            </Pressable>
          )
        })}
      </View>
    </OnboardingStep>
  )
}

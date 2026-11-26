import { Pressable } from 'react-native'

import { NATURE } from '@/src/art/images'
import { OnboardingStep } from '@/src/components/OnboardingStep'
import { Photo } from '@/src/components/Photo'
import { Txt } from '@/src/components/ui'
import { usePrefs } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function ReminderStep() {
  const on = usePrefs((state) => state.eveningReminder)
  const setOn = usePrefs((state) => state.setEveningReminder)
  const { colors } = useAppTheme()
  return (
    <OnboardingStep step="3 of 4" title="A gentle evening nudge?" body="Optional. Turning it off never affects your streak." next="/version">
      <Photo source={NATURE.leaves} alt="Leaves in soft light" height={140} />
      <Pressable accessibilityRole="switch" accessibilityState={{ checked: on }} onPress={() => setOn(!on)} style={{ minHeight: 52, borderRadius: 14, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: on ? colors.accent : colors.surface }}>
        <Txt weight={700} color={on ? colors.onAccent : colors.text}>{on ? 'Remind me in the evening' : 'No reminder for now'}</Txt>
      </Pressable>
    </OnboardingStep>
  )
}

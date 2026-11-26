import { useState } from 'react'
import { Platform, Pressable } from 'react-native'

import { useAuth } from '@/src/auth/AuthProvider'
import { savePrayerReminder } from '@/src/data/wellness'
import { syncPrayerReminder } from '@/src/prayer/notify'
import { IN_APP_REMINDER_COPY, reminderChannel } from '@/src/prayer/reminders'

import { NATURE } from '@/src/art/images'
import { OnboardingStep } from '@/src/components/OnboardingStep'
import { Photo } from '@/src/components/Photo'
import { Txt } from '@/src/components/ui'
import { usePrefs } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function ReminderStep() {
  const on = usePrefs((state) => state.eveningReminder)
  const setOn = usePrefs((state) => state.setEveningReminder)
  const time = usePrefs((state) => state.eveningTime)
  const { user } = useAuth()
  const { colors } = useAppTheme()
  const [note, setNote] = useState(reminderChannel(Platform.OS) === 'in-app' ? IN_APP_REMINDER_COPY : 'Turning this on asks this phone for permission.')
  return (
    <OnboardingStep step="3 of 4" title="A gentle evening nudge?" body="Optional. Turning it off never affects your streak." next="/version">
      <Photo source={NATURE.leaves} alt="Leaves in soft light" height={140} />
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: on }}
        onPress={() => {
          const next = !on
          setOn(next)
          void syncPrayerReminder('evening', next, time).then(async (result) => {
            if (!result.ok) setOn(false)
            setNote(result.message)
            if (result.ok && user) await savePrayerReminder(user.id, 'evening', next, time)
          })
        }}
        style={{ minHeight: 52, borderRadius: 14, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: on ? colors.accent : colors.surface }}
      >
        <Txt weight={700} color={on ? colors.onAccent : colors.text}>{on ? 'Remind me in the evening' : 'No reminder for now'}</Txt>
      </Pressable>
      <Txt color={colors.muted}>{note}</Txt>
    </OnboardingStep>
  )
}

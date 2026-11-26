import { Button, Card, Txt } from '@/src/components/ui'
import { usePrefs } from '@/src/preferences/store'

import { localDayKey, reminderDue } from './reminders'

export function InAppReminder({ slot, enabled, time }: { slot: 'morning' | 'evening'; enabled: boolean; time: string }) {
  const fired = usePrefs((state) => (slot === 'morning' ? state.morningFired : state.eveningFired))
  const mark = usePrefs((state) => state.markReminderFired)
  const now = new Date()
  const today = localDayKey(now)
  const due = enabled && reminderDue(time, now.getHours() * 60 + now.getMinutes(), fired || null, today)
  if (!due) return null
  return (
    <Card>
      <Txt weight={700}>{slot === 'morning' ? 'Morning prayer' : 'Evening prayer'}</Txt>
      <Txt>A short prayer is here if you want it. On the website this stays on the screen. It does not change your streak.</Txt>
      <Button label="I'm here" onPress={() => mark(slot, today)} />
    </Card>
  )
}

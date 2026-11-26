export type ReminderSlot = 'morning' | 'evening' | 'meals' | 'situations'

const DEFAULTS: Record<ReminderSlot, string> = {
  morning: '07:30',
  evening: '21:00',
  meals: '12:30',
  situations: '16:00',
}

export function defaultRemindTime(slot: ReminderSlot): string {
  return DEFAULTS[slot]
}

/** Accepts 24-hour HH:MM. Returns null when the value is not a real time. */
export function parseRemindTime(value: string): string | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim())
  if (!match) return null
  return `${match[1]}:${match[2]}`
}

export function minutesOfDay(hhmm: string): number | null {
  const parsed = parseRemindTime(hhmm)
  if (!parsed) return null
  const [hours, minutes] = parsed.split(':').map(Number)
  return (hours ?? 0) * 60 + (minutes ?? 0)
}

/**
 * A reminder is due when the clock has reached its time today and it has not
 * already fired for this local date. The caller stores the last fired date.
 */
export function localDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** Lock-screen alerts exist only on the phone apps. The website keeps the reminder inside the screen. */
export function reminderChannel(platform: string): 'device' | 'in-app' {
  return platform === 'ios' || platform === 'android' ? 'device' : 'in-app'
}

export const IN_APP_REMINDER_COPY =
  'On this website the reminder stays in the app. A lock-screen notification is only on the iPhone and Android apps.'

export function reminderDue(time: string, nowMinutes: number, lastFiredDate: string | null, today: string): boolean {
  const target = minutesOfDay(time)
  if (target === null) return false
  if (lastFiredDate === today) return false
  return nowMinutes >= target
}

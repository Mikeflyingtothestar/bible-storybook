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
export function reminderDue(time: string, nowMinutes: number, lastFiredDate: string | null, today: string): boolean {
  const target = minutesOfDay(time)
  if (target === null) return false
  if (lastFiredDate === today) return false
  return nowMinutes >= target
}

import { describe, expect, it } from 'vitest'

import { IN_APP_REMINDER_COPY, localDayKey, reminderChannel, reminderDue } from './reminders'

describe('prayer reminders', () => {
  it('keeps lock-screen alerts on the phone and the website in the app', () => {
    expect(reminderChannel('ios')).toBe('device')
    expect(reminderChannel('android')).toBe('device')
    expect(reminderChannel('web')).toBe('in-app')
    expect(IN_APP_REMINDER_COPY).toMatch(/iPhone and Android/)
  })

  it('fires once per local day after the chosen minute', () => {
    expect(reminderDue('21:00', 20 * 60, null, '2026-11-26')).toBe(false)
    expect(reminderDue('21:00', 21 * 60, null, '2026-11-26')).toBe(true)
    expect(reminderDue('21:00', 21 * 60, '2026-11-26', '2026-11-26')).toBe(false)
    expect(localDayKey(new Date(2026, 10, 26, 22, 0))).toBe('2026-11-26')
  })
})
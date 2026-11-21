import { describe, expect, it } from 'vitest'

import { addActiveSeconds, isActivelyReading, localDateISO, SESSION_MAX_SECONDS } from './activeTime'

describe('reading session timer', () => {
  it('counts seconds only while visible and recently active', () => {
    expect(isActivelyReading(true, 10_000)).toBe(true)
    expect(isActivelyReading(true, 60_000)).toBe(false)
    expect(isActivelyReading(false, 0)).toBe(false)
    expect(addActiveSeconds(5, 2500, true)).toBe(7)
    expect(addActiveSeconds(5, 2500, false)).toBe(5)
  })

  it('caps a session at four hours', () => {
    expect(addActiveSeconds(SESSION_MAX_SECONDS - 1, 10_000, true)).toBe(SESSION_MAX_SECONDS)
  })

  it('formats the device-local date', () => {
    const date = new Date('2026-11-21T23:30:00Z')
    expect(localDateISO(date, 'Pacific/Auckland')).toBe('2026-11-22')
    expect(localDateISO(date, 'UTC')).toBe('2026-11-21')
  })
})

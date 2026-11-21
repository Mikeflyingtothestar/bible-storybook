import { describe, expect, it } from 'vitest'

import { fadeAmount, formatClock, timerRemainingMs } from './timer'

describe('bedtime timer', () => {
  it('counts down and fades in the last half minute', () => {
    expect(timerRemainingMs(10_000, 4_000)).toBe(6_000)
    expect(timerRemainingMs(10_000, 12_000)).toBe(0)
    expect(fadeAmount(60_000)).toBe(1)
    expect(fadeAmount(15_000)).toBeCloseTo(0.5)
    expect(fadeAmount(0)).toBe(1)
    expect(formatClock(65_000)).toBe('1:05')
  })
})

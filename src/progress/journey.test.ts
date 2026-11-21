import { describe, expect, it } from 'vitest'

import { computeStreak, journeyPoints, levelForPoints, qualifyingDates, type ReadingDay } from './journey'

describe('faith journey', () => {
  it('awards capped daily points, plan days, and full weeks of streak', () => {
    const days: ReadingDay[] = [
      { date: '2026-11-01', seconds: 600, completed: true },
      { date: '2026-11-02', seconds: 30, completed: false },
      { date: '2026-11-03', seconds: 3600, completed: true },
    ]
    // 10 min -> min(30, 10)+10 = 20; 30s ignored; 60 min -> 30+10 = 40; plan 2*5; streak 7 -> +14
    expect(journeyPoints(days, 2, 7)).toBe(20 + 40 + 10 + 14)
  })

  it('forgives up to two missed days and drops a cold streak', () => {
    expect(computeStreak(['2026-11-21', '2026-11-20', '2026-11-18'], '2026-11-21')).toEqual({
      streak: 3,
      graceLeft: 1,
    })
    expect(computeStreak(['2026-11-10'], '2026-11-21').streak).toBe(0)
  })

  it('counts a day with a completed item even under five minutes', () => {
    const days: ReadingDay[] = [{ date: '2026-11-21', seconds: 40, completed: true }]
    expect(qualifyingDates(days)).toEqual(['2026-11-21'])
  })

  it('maps points onto levels and never invents a level past the last one', () => {
    expect(levelForPoints(0).current.name).toBe('Seed')
    expect(levelForPoints(150).current.name).toBe('Sprout')
    expect(levelForPoints(5000).current.name).toBe('Lamp to My Feet')
    expect(levelForPoints(9000).next).toBeNull()
  })
})

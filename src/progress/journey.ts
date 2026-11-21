/** Client mirror of `recompute_my_progress` so the rules can be tested without the database. */

export type ReadingDay = {
  /** ISO date YYYY-MM-DD */
  date: string
  seconds: number
  completed: boolean
}

export const JOURNEY_LEVELS = [
  { level: 1, name: 'Seed', minPoints: 0, meaning: 'Just started' },
  { level: 2, name: 'Sprout', minPoints: 150, meaning: 'Reading has begun to take root' },
  { level: 3, name: 'Rooted', minPoints: 500, meaning: 'A regular reading habit' },
  { level: 4, name: 'Growing Branch', minPoints: 1200, meaning: 'Steady over months' },
  { level: 5, name: 'Fruitful', minPoints: 2500, meaning: 'A long, consistent journey' },
  { level: 6, name: 'Lamp to My Feet', minPoints: 5000, meaning: 'From Psalm 119:105' },
] as const

export function levelForPoints(points: number) {
  let current: (typeof JOURNEY_LEVELS)[number] = JOURNEY_LEVELS[0]
  for (const level of JOURNEY_LEVELS) {
    if (points >= level.minPoints) current = level
  }
  const next = JOURNEY_LEVELS.find((level) => level.minPoints > points) ?? null
  return { current, next }
}

function dayNumber(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number)
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000)
}

/** Days that count toward a streak: 5 minutes, or a completed chapter/story. */
export function qualifyingDates(days: ReadingDay[]): string[] {
  return days
    .filter((day) => day.seconds >= 300 || day.completed)
    .map((day) => day.date)
    .sort()
}

/**
 * Streak walk from the SQL function.
 * A missed day is forgiven up to twice (`grace` starts at 2).
 * If the newest qualifying day is older than today by more than 1 + grace, the streak is 0.
 */
export function computeStreak(datesNewestFirst: string[], today: string): { streak: number; graceLeft: number } {
  let grace = 2
  let streak = 0
  let prev: number | null = null
  const todayN = dayNumber(today)

  for (const iso of datesNewestFirst) {
    const d = dayNumber(iso)
    if (prev === null) {
      if (todayN - d > 1 + grace) break
      streak = 1
    } else if (prev - d === 1) {
      streak += 1
    } else if (prev - d - 1 <= grace) {
      grace -= prev - d - 1
      streak += 1
    } else {
      break
    }
    prev = d
  }

  return { streak, graceLeft: grace }
}

export function journeyPoints(days: ReadingDay[], planDaysCompleted: number, streak: number): number {
  let points = 0
  for (const day of days) {
    if (day.seconds >= 60) points += Math.min(30, Math.floor(day.seconds / 60)) + 10
  }
  points += 5 * planDaysCompleted
  points += 2 * Math.floor(streak / 7) * 7
  return points
}

function shift(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1))
  date.setUTCDate(date.getUTCDate() + days)
  const nextMonth = String(date.getUTCMonth() + 1).padStart(2, '0')
  const nextDay = String(date.getUTCDate()).padStart(2, '0')
  return `${date.getUTCFullYear()}-${nextMonth}-${nextDay}`
}

/**
 * Counts consecutive gratitude days ending today. If today is still empty but
 * yesterday was marked, the streak stays alive until the day closes.
 */
export function gratitudeStreak(localDates: readonly string[], today: string): number {
  const marked = new Set(localDates)
  let cursor = today
  if (!marked.has(cursor)) {
    cursor = shift(today, -1)
    if (!marked.has(cursor)) return 0
  }
  let count = 0
  while (marked.has(cursor)) {
    count += 1
    cursor = shift(cursor, -1)
  }
  return count
}

/** A missed day pauses the count. The words never scold. */
export function streakMessage(count: number): string {
  if (count <= 0) return 'A gentle start, whenever you are ready'
  return `🔥 ${count}-day streak · keep it gentle`
}

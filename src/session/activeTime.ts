export const IDLE_LIMIT_MS = 60_000
export const SESSION_MAX_SECONDS = 14_400

export function isActivelyReading(visible: boolean, idleMs: number, idleLimitMs = IDLE_LIMIT_MS): boolean {
  return visible && idleMs < idleLimitMs
}

/** Add whole seconds only while the reader is visible and not idle. Caps at 4 hours. */
export function addActiveSeconds(current: number, elapsedMs: number, active: boolean): number {
  if (!active || elapsedMs <= 0) return current
  return Math.min(SESSION_MAX_SECONDS, current + Math.floor(elapsedMs / 1000))
}

export function localDateISO(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
  return parts
}

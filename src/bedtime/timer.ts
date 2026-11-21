export const SLEEP_TIMER_CHOICES = [5, 10, 15, 30, 45, 60, 90, 120] as const

export function timerRemainingMs(endsAt: number, now: number): number {
  return Math.max(0, endsAt - now)
}

export function fadeAmount(remainingMs: number, windowMs = 30_000): number {
  if (remainingMs <= 0 || remainingMs >= windowMs) return 1
  return Math.max(0.2, remainingMs / windowMs)
}

export function formatClock(remainingMs: number): string {
  const total = Math.ceil(remainingMs / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

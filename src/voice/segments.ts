export type SpeechSegment = {
  id: string
  text: string
  label?: string
}

export function versesToSegments(verses: { number: number; text: string }[]): SpeechSegment[] {
  return verses
    .filter((verse) => verse.text.trim().length > 0)
    .map((verse) => ({
      id: String(verse.number),
      text: verse.text.replace(/\s+/g, ' ').trim(),
      label: String(verse.number),
    }))
}

/** Calm speaking length. Rate is clamped to the listen-bar range. */
export function segmentDurationMs(text: string, rate: number): number {
  const words = Math.max(1, text.trim().split(/\s+/).filter(Boolean).length)
  const safeRate = Math.min(1.5, Math.max(0.75, rate))
  return Math.round((words / (2.4 * safeRate)) * 1000)
}

export function clampRate(rate: number): number {
  if (Number.isNaN(rate)) return 1
  return Math.min(1.5, Math.max(0.75, rate))
}

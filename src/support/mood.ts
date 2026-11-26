import { distressDetected, CRISIS_RESOURCES } from '../companion/answer'
import { requireVerse, type CitedVerse } from '../wellness/bundled'

export const MOODS = ['calm', 'grateful', 'anxious', 'sad', 'tired', 'hopeful'] as const
export type Mood = (typeof MOODS)[number]

const LINES: Record<Mood, { text: string; ref: string }> = {
  calm: { text: 'Stay with the quieter picture: still water, and a soul restored.', ref: 'PSA.23.2' },
  grateful: { text: 'Goodness, in this line, follows. You do not have to chase it.', ref: 'PSA.23.6' },
  anxious: { text: 'The verse leaves tomorrow where it is. One day is enough.', ref: 'MAT.6.34' },
  sad: { text: 'The valley is not denied. The line says you are not alone in it.', ref: 'PSA.23.4' },
  tired: { text: 'The keeper in this psalm does not slumber, so you can.', ref: 'PSA.121.4' },
  hopeful: { text: 'Light, here, is something the darkness has not overcome.', ref: 'JHN.1.5' },
}

export function encouragementFor(mood: Mood): { text: string; verse: CitedVerse } {
  const line = LINES[mood]
  return { text: line.text, verse: requireVerse(line.ref) }
}

export function supportForNote(note: string, mood: Mood): { text: string; verse: CitedVerse; crisis: typeof CRISIS_RESOURCES | null } {
  const base = encouragementFor(mood)
  return { ...base, crisis: distressDetected(note) ? CRISIS_RESOURCES : null }
}

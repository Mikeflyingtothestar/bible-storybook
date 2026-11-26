import { requireVerse, type CitedVerse } from '../wellness/bundled'
import { TOPICS, type TopicId } from '../wellness/topics'
import { TOPIC_VERSE_MAP } from '../companion/answer'

export type DailyTeaching = {
  topic: TopicId
  verse: CitedVerse
  reflection: string
  dayKey: string
}

const REFLECTIONS: Record<TopicId, string> = {
  anxiety: 'You do not have to settle tomorrow before this day is over. The verse brings you back to what is in front of you, and that is enough for now.',
  forgiveness: 'The prayer asks to be forgiven and to forgive in the same breath. You can start with one small release, even if the rest still hurts.',
  grief: 'The psalm does not pretend the valley is gone. It says you are not walking it by yourself, and you can go as slowly as you need.',
  purpose: 'You were made, and the text calls that life a light. You do not have to prove your worth before you take the next quiet step.',
  gratitude: 'Goodness in this verse follows you. It is not a prize you have to earn before the day can be kind.',
  rest: 'Picture a green field and water that is not rushing. Your soul is allowed to be restored without a performance.',
  courage: 'Courage here is not the absence of a dark place. It is company while you walk through it, one step at a time.',
  peace: 'The help in this psalm is steady, like the one who made heaven and earth. You can set the worry down for a minute.',
}

export function dayKey(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function dayNumber(key: string): number {
  const [year, month, day] = key.split('-').map(Number)
  return Math.floor(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1) / 86_400_000)
}

export function dailyTeaching(chosen: readonly TopicId[], date: Date): DailyTeaching {
  const pool = chosen.length > 0 ? chosen : TOPICS
  const key = dayKey(date)
  const topic = pool[dayNumber(key) % pool.length] ?? 'peace'
  const refs = TOPIC_VERSE_MAP[topic]
  const verse = requireVerse(refs[dayNumber(key) % refs.length] ?? refs[0] ?? 'PSA.23.1')
  return { topic, verse, reflection: REFLECTIONS[topic], dayKey: key }
}

const WEEK_LINES = [
  'Start with the verse by itself. One sentence is a complete practice. You can close the app after that.',
  'Read it once more, a little slower, and notice a single word that stays with you. There is no grade at the end.',
  'If you want, say the line out loud. If you would rather sit in silence, that counts too.',
  'Take one phrase with you into the next ordinary thing you do. Let it be small enough to carry.',
  'When your mind wanders, come back to the same line. Wandering is part of reading, not a failure.',
  'Let the verse sit beside whatever today already is. You do not have to make the day prettier first.',
  'Close the week by thanking the text for being short. Seven days of a few minutes is a real rhythm.',
]

/** Seven days of the same personal topic, so a goal shapes the whole week. */
export function weekTeaching(chosen: readonly TopicId[], date: Date): DailyTeaching & { dayOfWeek: number; listenText: string } {
  const base = dailyTeaching(chosen, date)
  const dayOfWeek = dayNumber(base.dayKey) % 7
  const line = WEEK_LINES[dayOfWeek] ?? WEEK_LINES[0]
  return {
    ...base,
    dayOfWeek: dayOfWeek + 1,
    reflection: line,
    listenText: `${base.verse.label}. ${base.verse.text} ${line}`,
  }
}

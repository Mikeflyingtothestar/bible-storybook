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
  anxiety: 'The verse names worry and then points you back to today, not to tomorrow.',
  forgiveness: 'The prayer asks to be forgiven in the same breath that it asks us to forgive.',
  grief: 'The psalm does not deny the valley. It says the speaker is not walking it alone.',
  purpose: 'The text starts with being made, and with a life that is called light.',
  gratitude: 'Goodness, in this verse, is something that follows rather than something you earn.',
  rest: 'The picture is simple: green pasture, still water, a soul restored.',
  courage: 'Courage here is not the absence of a dark valley. It is company inside it.',
  peace: 'Help, in this psalm, is located with the one who made heaven and earth.',
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
  'Start with the verse alone. One sentence is enough.',
  'Read it once more, slowly, and notice one word.',
  'Say the verse out loud if you want. Silence is fine too.',
  'Carry one phrase into the next ordinary task.',
  'If your mind wanders, come back to the same line.',
  'Let the verse sit beside whatever the day already is.',
  'Close the week by thanking the text for being short.',
]

/** Seven days of the same personal topic, so a goal shapes the whole week. */
export function weekTeaching(chosen: readonly TopicId[], date: Date): DailyTeaching & { dayOfWeek: number; listenText: string } {
  const base = dailyTeaching(chosen, date)
  const dayOfWeek = dayNumber(base.dayKey) % 7
  const line = WEEK_LINES[dayOfWeek] ?? WEEK_LINES[0]
  return {
    ...base,
    dayOfWeek: dayOfWeek + 1,
    reflection: `${base.reflection} ${line}`,
    listenText: `${base.verse.label}. ${base.verse.text} ${base.reflection} ${line}`,
  }
}

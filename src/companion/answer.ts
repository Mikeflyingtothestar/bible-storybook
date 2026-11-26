import { searchSample } from '../bible/sample'
import { guideFor, TOPIC_GUIDES } from './library'
import { requireVerse, verseByRef, type CitedVerse } from '../wellness/bundled'
import { isTopic, type TopicId } from '../wellness/topics'

export const COMPANION_DISCLAIMER = 'This is not a therapist, a pastor, or medical advice. It only repeats verses from the bundled public-domain Bible.'

export const CRISIS_RESOURCES = {
  befriendersMalaysia: 'https://www.befrienders.org.my/',
  findAHelpline: 'https://findahelpline.com',
} as const

const TOPIC_REFS: Record<TopicId, string[]> = Object.fromEntries(TOPIC_GUIDES.map((guide) => [guide.id, guide.refs])) as Record<TopicId, string[]>

const TOPIC_WORDS: Record<TopicId, string[]> = {
  anxiety: ['anxious', 'anxiety', 'worry', 'worried', 'afraid'],
  forgiveness: ['forgive', 'forgiven', 'forgiveness', 'trespass', 'debt'],
  grief: ['grief', 'mourn', 'mourning', 'loss', 'died', 'death'],
  purpose: ['purpose', 'meaning', 'image', 'created', 'why am i'],
  gratitude: ['thank', 'thanks', 'grateful', 'gratitude'],
  rest: ['rest', 'sleep', 'weary', 'tired', 'still water'],
  courage: ['courage', 'fear', 'afraid', 'evil'],
  peace: ['peace', 'calm', 'help', 'keeper', 'safe'],
  loneliness: ['lonely', 'loneliness', 'alone', 'nobody', 'isolated'],
  anger: ['anger', 'angry', 'furious', 'rage', 'resent'],
}

const DISTRESS = [
  'suicide',
  'suicidal',
  'kill myself',
  'end my life',
  'want to die',
  'self-harm',
  'self harm',
  'hurt myself',
]

export type CompanionResult =
  | { kind: 'need-more'; text: string; disclaimer: string }
  | {
      kind: 'answer'
      text: string
      citations: CitedVerse[]
      crisis: { befriendersMalaysia: string; findAHelpline: string } | null
      disclaimer: string
    }

export function distressDetected(text: string): boolean {
  const haystack = text.toLowerCase()
  return DISTRESS.some((phrase) => haystack.includes(phrase))
}

export function topicsIn(text: string): TopicId[] {
  const haystack = text.toLowerCase()
  return (Object.keys(TOPIC_WORDS) as TopicId[]).filter((topic) => TOPIC_WORDS[topic].some((word) => haystack.includes(word)))
}

function unique(verses: CitedVerse[]): CitedVerse[] {
  const seen = new Set<string>()
  const result: CitedVerse[] = []
  for (const verse of verses) {
    if (seen.has(verse.osisRef)) continue
    seen.add(verse.osisRef)
    result.push(verse)
  }
  return result
}

export function citationsFor(question: string): CitedVerse[] {
  const fromTopics = topicsIn(question).flatMap((topic) => TOPIC_REFS[topic].map(requireVerse))
  const fromSearch = searchSample(question)
    .map((hit) => verseByRef(hit.osisRef))
    .filter((verse): verse is CitedVerse => verse !== null)
  return unique([...fromTopics, ...fromSearch]).slice(0, 4)
}

export function answerQuestion(question: string): CompanionResult {
  const trimmed = question.trim()
  const disclaimer = COMPANION_DISCLAIMER
  if (trimmed.length < 2) {
    return { kind: 'need-more', text: 'Ask in a few words, such as rest, forgiveness, or worry.', disclaimer }
  }
  const crisis = distressDetected(trimmed)
  const citations = citationsFor(crisis ? `${trimmed} grief anxiety` : trimmed)
  const quoted = (citations.length > 0 ? citations : [requireVerse('PSA.23.1')]).slice(0, 4)
  const lines = quoted.map((verse) => `${verse.label}: “${verse.text}”`)
  const topic = topicsIn(trimmed)[0]
  const guide = topic ? guideFor(topic) : null
  const lead = crisis
    ? 'This is not a therapist. If you might harm yourself, contact local emergency services now. findahelpline.com lists lines by country, and Befrienders Malaysia is one place to start. The bundled text says:'
    : guide
      ? `${guide.reflection} A short prayer: ${guide.prayer} The bundled World English Bible says:`
      : 'Here is what the bundled World English Bible says, and nothing beyond it.'
  return {
    kind: 'answer',
    text: `${lead} ${lines.join(' ')}`,
    citations: quoted,
    crisis: crisis ? CRISIS_RESOURCES : null,
    disclaimer,
  }
}

export const TOPIC_VERSE_MAP: Record<TopicId, string[]> = TOPIC_REFS

export function knownTopic(value: string): TopicId | null {
  return isTopic(value) ? value : null
}

import { searchSample } from '../bible/sample'
import { requireVerse, verseByRef, type CitedVerse } from '../wellness/bundled'
import { isTopic, type TopicId } from '../wellness/topics'

export const COMPANION_DISCLAIMER = 'This is not pastoral or medical advice. It only repeats verses from the bundled public-domain Bible.'

export const CRISIS_RESOURCES = {
  befriendersMalaysia: 'https://www.befrienders.org.my/',
  findAHelpline: 'https://findahelpline.com',
} as const

const TOPIC_REFS: Record<TopicId, string[]> = {
  anxiety: ['MAT.6.25', 'MAT.6.34', 'PSA.23.4'],
  forgiveness: ['MAT.6.12', 'MAT.6.14'],
  grief: ['PSA.23.4', 'JHN.1.5'],
  purpose: ['GEN.1.27', 'JHN.1.4', 'MAT.6.33'],
  gratitude: ['PSA.23.6', 'GEN.1.31'],
  rest: ['PSA.23.2', 'PSA.23.3'],
  courage: ['PSA.23.4', 'PSA.121.2'],
  peace: ['PSA.23.2', 'PSA.121.7', 'PSA.121.8'],
}

const TOPIC_WORDS: Record<TopicId, string[]> = {
  anxiety: ['anxious', 'anxiety', 'worry', 'worried', 'afraid'],
  forgiveness: ['forgive', 'forgiven', 'forgiveness', 'trespass', 'debt'],
  grief: ['grief', 'mourn', 'mourning', 'loss', 'died', 'death'],
  purpose: ['purpose', 'meaning', 'image', 'created', 'why am i'],
  gratitude: ['thank', 'thanks', 'grateful', 'gratitude'],
  rest: ['rest', 'sleep', 'weary', 'tired', 'still water'],
  courage: ['courage', 'fear', 'afraid', 'evil'],
  peace: ['peace', 'calm', 'help', 'keeper', 'safe'],
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
  return unique([...fromTopics, ...fromSearch]).slice(0, 3)
}

export function answerQuestion(question: string): CompanionResult {
  const trimmed = question.trim()
  const disclaimer = COMPANION_DISCLAIMER
  if (trimmed.length < 2) {
    return { kind: 'need-more', text: 'Ask in a few words, such as rest, forgiveness, or worry.', disclaimer }
  }
  const crisis = distressDetected(trimmed)
  const citations = citationsFor(crisis ? `${trimmed} grief anxiety` : trimmed)
  const quoted = (citations.length > 0 ? citations : [requireVerse('PSA.23.1')]).slice(0, 3)
  const lines = quoted.map((verse) => `${verse.label}: “${verse.text}”`)
  const lead = crisis
    ? 'If you might act on thoughts of harm, contact local emergency services now. Befrienders Malaysia and findahelpline.com can help you find someone to talk with. The bundled text says:'
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

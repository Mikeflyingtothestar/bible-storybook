import { searchSample } from '../bible/sample'
import { guideFor, TOPIC_GUIDES } from './library'
import { requireVerse, verseByRef, type CitedVerse } from '../wellness/bundled'
import { isTopic, type TopicId } from '../wellness/topics'

export const COMPANION_DISCLAIMER = 'This is not a therapist, a pastor, or medical advice. It only repeats verses from the bundled public-domain Bible.'

export const CRISIS_RESOURCES = {
  befriendersMalaysia: 'https://www.befrienders.org.my/',
  befriendersWorldwide: 'https://www.befrienders.org/',
  findAHelpline: 'https://findahelpline.com',
} as const

/** World English Bible, public domain. Not in the small bundled sample, so it is quoted here in full. */
export const CRISIS_VERSE: CitedVerse = {
  osisRef: 'PSA.34.18',
  label: 'Psalm 34:18',
  text: 'Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.',
}

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

const CRISIS_PHRASES = [
  'suicide',
  'suicidal',
  'kill myself',
  'killing myself',
  'end my life',
  'end it all',
  'want to die',
  'self harm',
  'hurt myself',
  'hurting myself',
  "don't want to live",
  'dont want to live',
  'do not want to live',
]

const CRISIS_COMPACT = ['selfharm', 'killmyself', 'killingmyself', 'enditall', 'endmylife', 'wanttodie', 'hurtmyself', 'hurtingmyself']

export type CompanionResult =
  | { kind: 'need-more'; text: string; disclaimer: string }
  | {
      kind: 'answer'
      reflection: string
      prayer: string | null
      citations: CitedVerse[]
      disclaimer: string
    }
  | { kind: 'crisis'; verse: CitedVerse; disclaimer: string }

/** Lower-case, straighten apostrophes, and treat hyphens as spaces. */
export function normalizeForDistress(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[-‐‑‒–—/]+/g, ' ')
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function distressDetected(text: string): boolean {
  const normalized = normalizeForDistress(text)
  if (!normalized) return false
  if (CRISIS_PHRASES.some((phrase) => normalized.includes(phrase))) return true
  const compact = normalized.replace(/ /g, '')
  return CRISIS_COMPACT.some((phrase) => compact.includes(phrase))
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
  if (distressDetected(trimmed)) {
    return { kind: 'crisis', verse: CRISIS_VERSE, disclaimer }
  }
  const topic = topicsIn(trimmed)[0]
  const guide = topic ? guideFor(topic) : null
  const citations = citationsFor(trimmed)
  const quoted = (citations.length > 0 ? citations : [requireVerse('PSA.23.1')]).slice(0, 4)
  return {
    kind: 'answer',
    reflection: guide?.reflection ?? 'Here is what the bundled World English Bible says, and nothing beyond it.',
    prayer: guide?.prayer ?? null,
    citations: quoted,
    disclaimer,
  }
}

export const TOPIC_VERSE_MAP: Record<TopicId, string[]> = TOPIC_REFS

export function knownTopic(value: string): TopicId | null {
  return isTopic(value) ? value : null
}

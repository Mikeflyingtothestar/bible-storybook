import type { Intention } from '../preferences/store'
import type { TopicId } from './topics'

export const INTENTIONS: { id: Intention; label: string; topic: TopicId }[] = [
  { id: 'sleep', label: 'Sleep', topic: 'rest' },
  { id: 'stress', label: 'Stress', topic: 'anxiety' },
  { id: 'grief', label: 'Grief', topic: 'grief' },
  { id: 'growth', label: 'Growth', topic: 'purpose' },
  { id: 'family', label: 'Family', topic: 'peace' },
]

export function topicsForIntentions(intentions: readonly Intention[]): TopicId[] {
  const topics = INTENTIONS.filter((item) => intentions.includes(item.id)).map((item) => item.topic)
  return topics.length > 0 ? topics : ['peace']
}

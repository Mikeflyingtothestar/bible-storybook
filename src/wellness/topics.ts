export const TOPICS = ['anxiety', 'forgiveness', 'grief', 'purpose', 'gratitude', 'rest', 'courage', 'peace'] as const

export type TopicId = (typeof TOPICS)[number]

export function isTopic(value: string): value is TopicId {
  return (TOPICS as readonly string[]).includes(value)
}

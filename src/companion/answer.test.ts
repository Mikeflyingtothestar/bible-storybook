import { describe, expect, it } from 'vitest'

import { answerQuestion, distressDetected } from './answer'
import { TOPIC_GUIDES } from './library'
import { callCompanionLlm, COMPANION_LLM_ENABLED } from './llm'
import { gratitudeStreak, weekMarks } from '../journal/streak'
import { quizCorrect, PROGRAMMES, lessonProgress } from '../learn/programmes'
import { NIGHT_TIMERS, nightMinutes } from '../bedtime/timer'
import { verseByRef } from '../wellness/bundled'
import { dailyTeaching } from '../teachings/daily'
import { isWaitlistEmail, isWaitlistPlan } from '../pricing/plans'
import { topicsForIntentions } from '../wellness/goals'
import { encouragementFor, supportForNote } from '../support/mood'

describe('companion answers', () => {
  it('cites a bundled verse for worry', () => {
    const result = answerQuestion('I feel anxious about tomorrow')
    expect(result.kind).toBe('answer')
    if (result.kind !== 'answer') return
    expect(result.citations.length).toBeGreaterThan(0)
    expect(result.citations[0]?.label.length).toBeGreaterThan(3)
    expect(result.reflection.length).toBeGreaterThan(10)
    expect(result.disclaimer.toLowerCase()).toContain('not a therapist')
    expect(result.prayer).toBeTruthy()
    const anxiety = answerQuestion('I feel lonely')
    if (anxiety.kind !== 'answer') throw new Error('expected an answer')
    expect(anxiety.citations.length).toBeGreaterThanOrEqual(3)
  })

  it('keeps three public-domain verses, a reflection, and a prayer on every topic', () => {
    expect(TOPIC_GUIDES.map((guide) => guide.id)).toEqual(['anxiety', 'grief', 'forgiveness', 'purpose', 'gratitude', 'rest', 'courage', 'peace', 'loneliness', 'anger'])
    for (const guide of TOPIC_GUIDES) {
      expect(guide.refs.length).toBeGreaterThanOrEqual(3)
      expect(guide.reflection.length).toBeGreaterThan(20)
      expect(guide.prayer.length).toBeGreaterThan(10)
      for (const ref of guide.refs) expect(verseByRef(ref), ref).not.toBeNull()
    }
  })

  it('detects crisis phrasing without catching die to self', () => {
    for (const phrase of ['I want to die', 'KILL MYSELF', 'end it all', 'suicide', 'self-harm', 'self   harm', 'SelfHarm', "I don't want to live", 'I dont want to live', 'hurt myself']) {
      expect(distressDetected(phrase), phrase).toBe(true)
    }
    for (const phrase of ['die to self', 'I will die to self', 'the seed will die', 'I died to my old habits']) {
      expect(distressDetected(phrase), phrase).toBe(false)
    }
  })

  it('answers a crisis with one gentle verse and no anxiety text', () => {
    const result = answerQuestion('I want to die')
    expect(result.kind).toBe('crisis')
    if (result.kind !== 'crisis') return
    expect(result.verse.label).toBe('Psalm 34:18')
    expect(result.verse.text.toLowerCase()).not.toContain('anxious')
    expect(result.verse.text.toLowerCase()).not.toContain('eat')
    expect(JSON.stringify(result).toLowerCase()).not.toContain('matthew')
  })

  it('leaves the language model switched off', async () => {
    expect(COMPANION_LLM_ENABLED).toBe(false)
    await expect(callCompanionLlm({ question: 'rest', citations: [] })).resolves.toEqual({ used: false, reason: 'disabled' })
  })
})

describe('daily pieces', () => {
  it('repeats the same teaching for a date', () => {
    const date = new Date('2026-11-26T12:00:00Z')
    const first = dailyTeaching(topicsForIntentions(['stress']), date)
    const second = dailyTeaching(topicsForIntentions(['stress']), date)
    expect(first.verse.osisRef).toBe(second.verse.osisRef)
    expect(first.topic).toBe('anxiety')
  })

  it('counts a gratitude streak through today', () => {
    expect(gratitudeStreak(['2026-11-24', '2026-11-25', '2026-11-26'], '2026-11-26')).toBe(3)
    expect(gratitudeStreak(['2026-11-25'], '2026-11-26')).toBe(1)
    expect(gratitudeStreak(['2026-11-20'], '2026-11-26')).toBe(0)
    const marks = weekMarks(['2026-11-24', '2026-11-26'], '2026-11-26')
    expect(marks.map((mark) => mark.label)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    expect(marks[0]?.key).toBe('2026-11-23')
    expect(marks[1]?.opened).toBe(true)
    expect(marks[2]?.opened).toBe(false)
    expect(marks[3]?.isToday).toBe(true)
  })

  it('marks paid plans for the waitlist only', () => {
    expect(isWaitlistPlan('premium-monthly')).toBe(true)
    expect(isWaitlistPlan('free')).toBe(false)
    expect(isWaitlistEmail('reader@example.com')).toBe(true)
    expect(isWaitlistEmail('not-an-email')).toBe(false)
  })

  it('scores a lesson and tracks progress', () => {
    const lesson = PROGRAMMES[0]?.lessons[0]
    expect(lesson).toBeTruthy()
    if (!lesson) return
    const quiz = lesson.quiz[0]
    expect(quiz).toBeTruthy()
    if (!quiz) return
    expect(quizCorrect(quiz, quiz.answer)).toBe(true)
    expect(lessonProgress(3, 7)).toBe(43)
    for (const id of ['anxiety', 'sleep']) {
      const programme = PROGRAMMES.find((item) => item.id === id)
      expect(programme?.lessons).toHaveLength(5)
      expect(programme?.lessons.every((item) => item.quiz.length >= 3)).toBe(true)
    }
    expect(NIGHT_TIMERS).toEqual([5, 15, 30, 45])
    expect(nightMinutes('30')).toBe(30)
    expect(nightMinutes('7')).toBe(15)
  })

  it('adds crisis lines when a mood note is distressed', () => {
    const calm = encouragementFor('calm')
    expect(calm.verse.label.length).toBeGreaterThan(3)
    const hard = supportForNote('I want to die', 'sad')
    expect(hard.crisis?.befriendersMalaysia).toContain('befrienders')
  })
})

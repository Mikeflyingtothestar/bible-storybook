import { describe, expect, it } from 'vitest'

import { answerQuestion, distressDetected } from './answer'
import { callCompanionLlm, COMPANION_LLM_ENABLED } from './llm'
import { gratitudeStreak, weekMarks } from '../journal/streak'
import { quizCorrect, PROGRAMMES, lessonProgress } from '../learn/programmes'
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
    expect(result.text).toContain(result.citations[0]?.label)
    expect(result.disclaimer.toLowerCase()).toContain('not pastoral')
    expect(result.crisis).toBeNull()
  })

  it('shows crisis resources and still cites a verse', () => {
    expect(distressDetected('I want to die')).toBe(true)
    const result = answerQuestion('I want to die')
    if (result.kind !== 'answer') throw new Error('expected an answer')
    expect(result.crisis?.findAHelpline).toContain('findahelpline.com')
    expect(result.citations.length).toBeGreaterThan(0)
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
    expect(quizCorrect(lesson.quiz, lesson.quiz.answer)).toBe(true)
    expect(lessonProgress(3, 7)).toBe(43)
  })

  it('adds crisis lines when a mood note is distressed', () => {
    const calm = encouragementFor('calm')
    expect(calm.verse.label.length).toBeGreaterThan(3)
    const hard = supportForNote('I want to die', 'sad')
    expect(hard.crisis?.befriendersMalaysia).toContain('befrienders')
  })
})

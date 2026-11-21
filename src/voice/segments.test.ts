import { describe, expect, it } from 'vitest'

import { clampRate, segmentDurationMs, versesToSegments } from './segments'

describe('voice segments', () => {
  it('speaks one segment per verse and drops blanks', () => {
    const segments = versesToSegments([
      { number: 1, text: '  Yahweh is my shepherd.  ' },
      { number: 2, text: '   ' },
      { number: 3, text: 'He makes me lie down.' },
    ])
    expect(segments.map((segment) => segment.id)).toEqual(['1', '3'])
    expect(segments[0]?.text).toBe('Yahweh is my shepherd.')
  })

  it('slows down when the rate drops and ignores empty input', () => {
    const base = segmentDurationMs('one two three four', 1)
    const slow = segmentDurationMs('one two three four', 0.75)
    expect(slow).toBeGreaterThan(base)
    expect(segmentDurationMs('   ', 1)).toBeGreaterThan(0)
    expect(clampRate(4)).toBe(1.5)
    expect(clampRate(0.1)).toBe(0.75)
  })
})

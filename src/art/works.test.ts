import { describe, expect, it } from 'vitest'

import { ARTWORKS } from './works'

describe('public-domain art catalog', () => {
  it('lists eight Wikimedia Commons files', () => {
    expect(ARTWORKS).toHaveLength(8)
    const ids = new Set(ARTWORKS.map((work) => work.id))
    expect(ids.size).toBe(8)
  })

  it('points every work at a Commons file page', () => {
    for (const work of ARTWORKS) {
      expect(work.page.startsWith('https://commons.wikimedia.org/wiki/File:')).toBe(true)
      expect(work.title.length).toBeGreaterThan(3)
      expect(work.alt.length).toBeGreaterThan(20)
    }
  })
})
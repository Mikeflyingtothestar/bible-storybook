import { describe, expect, it } from 'vitest'

import { bedtime, themes, type ThemeName } from './tokens'
import { contrastRatio, meetsAa } from './contrast'

const names: ThemeName[] = ['light', 'dark', 'sepia']

describe('theme contrast', () => {
  it('keeps body, muted, accent, and gold text at WCAG AA', () => {
    for (const name of names) {
      const theme = themes[name]
      const pairs: [string, string, string][] = [
        ['text on bg', theme.text, theme.bg],
        ['text on surface', theme.text, theme.surface],
        ['muted on bg', theme.muted, theme.bg],
        ['muted on surface', theme.muted, theme.surface],
        ['accent on bg', theme.accent, theme.bg],
        ['accent on surface', theme.accent, theme.surface],
        ['onAccent on accent', theme.onAccent, theme.accent],
        ['gold text on bg', theme.goldText, theme.bg],
        ['gold text on surface', theme.goldText, theme.surface],
        ['onGold on gold', theme.onGold, theme.gold],
      ]
      for (const [label, fg, bg] of pairs) {
        expect(meetsAa(fg, bg), `${name} ${label} ${contrastRatio(fg, bg).toFixed(2)}`).toBe(true)
      }
    }
  })

  it('keeps bedtime amber text on the night background', () => {
    expect(meetsAa(bedtime.text, bedtime.bg)).toBe(true)
    expect(meetsAa(bedtime.muted, bedtime.bg)).toBe(true)
  })
})

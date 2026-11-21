import { describe, expect, it } from 'vitest'

import { canReadMedia, voiceLocked } from './access'

describe('entitlements', () => {
  it('locks premium voices while the flag is off', () => {
    const premium = { id: 'premium-narrator', tierRequired: 'plus' as const, featureFlag: 'premium_voices' }
    expect(voiceLocked(premium, 'free', { premium_voices: false })).toBe(true)
    expect(voiceLocked(premium, 'plus', { premium_voices: false })).toBe(true)
    expect(voiceLocked(premium, 'plus', { premium_voices: true })).toBe(false)
  })

  it('leaves the device voice open', () => {
    expect(voiceLocked({ id: 'device-default', tierRequired: 'free', featureFlag: null }, 'free', {})).toBe(false)
  })

  it('sends video to coming-soon or the paywall', () => {
    expect(canReadMedia({ flag: 'video_mode', tierRequired: 'premium', flagEnabled: false, tier: 'premium' })).toBe('flag-off')
    expect(canReadMedia({ flag: 'video_mode', tierRequired: 'premium', flagEnabled: true, tier: 'free' })).toBe('upgrade')
    expect(canReadMedia({ flag: 'scene_images', tierRequired: 'free', flagEnabled: true, tier: 'free' })).toBe('allowed')
  })
})

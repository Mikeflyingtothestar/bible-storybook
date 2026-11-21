export type Tier = 'free' | 'plus' | 'premium'

const RANK: Record<Tier, number> = { free: 0, plus: 1, premium: 2 }

export type VoiceAccess = {
  id: string
  tierRequired: Tier
  featureFlag: string | null
}

export function tierAtLeast(have: Tier, need: Tier): boolean {
  return RANK[have] >= RANK[need]
}

export function voiceLocked(voice: VoiceAccess, tier: Tier, flags: Record<string, boolean>): boolean {
  if (!tierAtLeast(tier, voice.tierRequired)) return true
  if (voice.featureFlag && !flags[voice.featureFlag]) return true
  return false
}

export type MediaGate = {
  flag: string | null
  tierRequired: Tier
  flagEnabled: boolean
  tier: Tier
}

/** Mirrors the media_assets read policy: flag on (or none) and tier high enough. */
export function canReadMedia(gate: MediaGate): 'allowed' | 'flag-off' | 'upgrade' {
  if (gate.flag && !gate.flagEnabled) return 'flag-off'
  if (!tierAtLeast(gate.tier, gate.tierRequired)) return 'upgrade'
  return 'allowed'
}

import { useQuery } from '@tanstack/react-query'

import { useAuth } from '../auth/AuthProvider'
import { supabase } from '../lib/supabase'
import { canReadMedia, voiceLocked, type Tier, type VoiceAccess } from './access'

type FlagRow = { key: string; enabled: boolean }
type VoiceRow = VoiceAccess & { name: string; provider: string; style: string; isBedtime: boolean }

const DEVICE_VOICES: VoiceRow[] = [
  { id: 'device-default', name: 'Device voice', provider: 'device', style: 'narrator', isBedtime: false, tierRequired: 'free', featureFlag: null },
  { id: 'device-calm', name: 'Device voice (slow, calm)', provider: 'device', style: 'calm', isBedtime: true, tierRequired: 'free', featureFlag: null },
]

export function useEntitlement() {
  const { user } = useAuth()
  const flags = useQuery({
    queryKey: ['flags'],
    queryFn: async () => {
      const { data, error } = await supabase.from('feature_flags').select('key, enabled').limit(20)
      if (error || !data) return {} as Record<string, boolean>
      return Object.fromEntries((data as FlagRow[]).map((row) => [row.key, row.enabled]))
    },
  })
  const entitlement = useQuery({
    queryKey: ['entitlement', user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data } = await supabase.from('entitlements').select('tier, expires_at').eq('user_id', user?.id ?? '').maybeSingle()
      const row = data as { tier: Tier; expires_at: string | null } | null
      if (!row) return 'free' as Tier
      if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) return 'free' as Tier
      return row.tier
    },
  })
  const voices = useQuery({
    queryKey: ['voices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voices')
        .select('id, name, provider, style, is_bedtime, tier_required, feature_flag')
        .eq('is_active', true)
      if (error || !data?.length) return DEVICE_VOICES
      return (data as {
        id: string
        name: string
        provider: string
        style: string
        is_bedtime: boolean
        tier_required: Tier
        feature_flag: string | null
      }[]).map((row) => ({
        id: row.id,
        name: row.name,
        provider: row.provider,
        style: row.style,
        isBedtime: row.is_bedtime,
        tierRequired: row.tier_required,
        featureFlag: row.feature_flag,
      }))
    },
  })

  const tier: Tier = entitlement.data ?? 'free'
  const flagMap = flags.data ?? {}
  const voiceList = (voices.data ?? DEVICE_VOICES).map((voice) => ({
    ...voice,
    locked: voiceLocked(voice, tier, flagMap),
  }))

  return {
    tier,
    flags: flagMap,
    voices: voiceList,
    billingEnabled: Boolean(flagMap.billing),
    mediaGate: (flag: string | null, tierRequired: Tier) =>
      canReadMedia({ flag, tierRequired, flagEnabled: flag ? Boolean(flagMap[flag]) : true, tier }),
  }
}

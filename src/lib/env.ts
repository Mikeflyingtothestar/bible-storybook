import Constants from 'expo-constants'

const extra = (Constants.expoConfig?.extra ?? {}) as {
  supabaseUrl?: string
  supabasePublishableKey?: string
}

/** Public project values. The service-role key is never read here. */
export const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || extra.supabaseUrl || 'https://nkpnanqbiehoqgnpmlhh.supabase.co'

export const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  extra.supabasePublishableKey ||
  'sb_publishable_6CxUJnf_A4jMTrgevmALUA_J9AHj_SV'

export function siteUrl(): string {
  const configured = process.env.EXPO_PUBLIC_SITE_URL
  if (configured) return configured.replace(/\/$/, '')
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin
  return 'http://localhost:8081'
}

export function authRedirect(): string {
  return `${siteUrl()}/auth/callback`
}

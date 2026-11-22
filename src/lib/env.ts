import Constants from 'expo-constants'

import { authCallbackFor, resolveSiteUrl } from './site-url'

const extra = (Constants.expoConfig?.extra ?? {}) as {
  supabaseUrl?: string
  supabasePublishableKey?: string
}

export { BASE_PATH, PRODUCTION_SITE_URL, resolveSiteUrl } from './site-url'

/** Public project values. The service-role key is never read here. */
export const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || extra.supabaseUrl || 'https://nkpnanqbiehoqgnpmlhh.supabase.co'

export const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  extra.supabasePublishableKey ||
  'sb_publishable_6CxUJnf_A4jMTrgevmALUA_J9AHj_SV'

export function siteUrl(): string {
  return resolveSiteUrl({
    configured: process.env.EXPO_PUBLIC_SITE_URL,
    origin: typeof window !== 'undefined' ? window.location.origin : undefined,
    pathname: typeof window !== 'undefined' ? window.location.pathname : undefined,
  })
}

export function authRedirect(): string {
  return authCallbackFor({
    configured: process.env.EXPO_PUBLIC_SITE_URL,
    origin: typeof window !== 'undefined' ? window.location.origin : undefined,
    pathname: typeof window !== 'undefined' ? window.location.pathname : undefined,
  })
}

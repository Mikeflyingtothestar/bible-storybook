/** Project site path. Expo `experiments.baseUrl` uses the same prefix. */
export const BASE_PATH = '/bible-storybook'

export const PRODUCTION_SITE_URL = 'https://mikeflyingtothestar.github.io/bible-storybook'

export function resolveSiteUrl(input: { configured?: string; origin?: string; pathname?: string }): string {
  const origin = input.origin?.replace(/\/$/, '')
  const pathname = input.pathname ?? ''
  if (origin && (pathname === BASE_PATH || pathname.startsWith(`${BASE_PATH}/`))) {
    return `${origin}${BASE_PATH}`
  }
  if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) return origin
  const configured = input.configured?.replace(/\/$/, '')
  if (configured) return configured
  return PRODUCTION_SITE_URL
}

export function authCallbackFor(input: { configured?: string; origin?: string; pathname?: string } = {}): string {
  return `${resolveSiteUrl(input)}/auth/callback`
}

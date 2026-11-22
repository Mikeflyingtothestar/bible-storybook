import { describe, expect, it } from 'vitest'

import { authCallbackFor, PRODUCTION_SITE_URL, resolveSiteUrl } from './site-url'

describe('site URL', () => {
  it('uses the GitHub Pages subpath for the production callback', () => {
    expect(PRODUCTION_SITE_URL).toBe('https://mikeflyingtothestar.github.io/bible-storybook')
    expect(
      resolveSiteUrl({
        origin: 'https://mikeflyingtothestar.github.io',
        pathname: '/bible-storybook/auth/callback',
      }),
    ).toBe(PRODUCTION_SITE_URL)
    const redirect = `${resolveSiteUrl({
      origin: 'https://mikeflyingtothestar.github.io',
      pathname: '/bible-storybook/',
    })}/auth/callback`
    expect(redirect).toBe('https://mikeflyingtothestar.github.io/bible-storybook/auth/callback')
  })

  it('keeps localhost usable and falls back to the public site', () => {
    expect(resolveSiteUrl({ origin: 'http://localhost:8081', pathname: '/' })).toBe('http://localhost:8081')
    expect(resolveSiteUrl({ origin: 'http://127.0.0.1:4173', pathname: '/bible-storybook/bible/GEN/1' })).toBe(
      'http://127.0.0.1:4173/bible-storybook',
    )
    expect(resolveSiteUrl({})).toBe(PRODUCTION_SITE_URL)
    expect(authCallbackFor({})).toBe(`${PRODUCTION_SITE_URL}/auth/callback`)
  })
})

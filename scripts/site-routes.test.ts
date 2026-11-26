import { describe, expect, it } from 'vitest'

import { collectRoutes } from './site-routes.mjs'

describe('site routes', () => {
  const routes = collectRoutes()

  it('includes the public entry points people open directly', () => {
    for (const path of ['/', '/pricing', '/onboarding', '/home', '/sign-up', '/bible/JHN/3', '/bible/PSA/23', '/stories/creation', '/bedtime/play/psalm-23', '/privacy', '/terms']) {
      expect(routes, path).toContain(path)
    }
  })

  it('expands every chapter so a refreshed reader is a real file', () => {
    expect(routes).toContain('/bible/PSA/150')
    expect(routes).toContain('/bible/REV/22')
    expect(routes.filter((route) => route.startsWith('/bible/GEN/'))).toHaveLength(50)
  })
})

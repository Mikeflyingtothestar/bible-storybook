import { describe, expect, it } from 'vitest'

import { friendlyAuthError } from './errors'

describe('auth errors', () => {
  it('maps known codes and provider setup failures', () => {
    expect(friendlyAuthError({ code: 'invalid_credentials' })).toMatch(/don’t match/)
    expect(friendlyAuthError({ code: 'over_email_send_rate_limit' })).toMatch(/Wait/)
    expect(friendlyAuthError({ message: 'Unsupported provider: provider is not enabled' })).toMatch(/isn’t switched on/)
    expect(friendlyAuthError({ message: 'User already registered' })).toMatch(/already exists/)
    expect(friendlyAuthError({ message: 'database exploded' })).toMatch(/try again/i)
  })
})

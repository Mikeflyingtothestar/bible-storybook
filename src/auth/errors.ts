type AuthLike = { message?: string; code?: string } | null | undefined

const BY_CODE: Record<string, string> = {
  invalid_credentials: 'That email and password don’t match. Try again, or reset your password.',
  invalid_grant: 'That email and password don’t match. Try again, or reset your password.',
  email_not_confirmed: 'Confirm your email first. You can ask for a fresh link below.',
  user_already_exists: 'An account with that email already exists. Try signing in.',
  user_already_registered: 'An account with that email already exists. Try signing in.',
  over_request_rate_limit: 'Too many attempts. Wait a little while, then try again.',
  over_email_send_rate_limit: 'Several emails are already on the way. Wait before asking for another.',
  otp_expired: 'That link has expired. Request a new one.',
  otp_disabled: 'Email sign-in links are turned off right now.',
  weak_password: 'Choose a stronger password, at least 8 characters.',
  validation_failed: 'Check the email address and try again.',
  email_address_invalid: 'That email address doesn’t look valid.',
  signup_disabled: 'New accounts are paused right now.',
  provider_disabled: 'That sign-in button isn’t switched on yet. Email still works.',
  unsupported_provider: 'That sign-in button isn’t switched on yet. Email still works.',
  access_denied: 'Sign-in was cancelled.',
  unexpected_failure: 'Something went wrong on our side. Please try again.',
}

export function friendlyAuthError(error: AuthLike): string {
  if (!error) return 'Something went wrong. Please try again.'
  const code = (error.code ?? '').toLowerCase()
  if (BY_CODE[code]) return BY_CODE[code]
  const message = (error.message ?? '').toLowerCase()
  if (message.includes('provider') && (message.includes('not enabled') || message.includes('unsupported'))) {
    return BY_CODE.provider_disabled
  }
  if (message.includes('already registered') || message.includes('already been registered') || message.includes('already exists')) {
    return BY_CODE.user_already_registered
  }
  if (message.includes('invalid login') || message.includes('invalid credentials')) return BY_CODE.invalid_credentials
  if (message.includes('rate limit') || message.includes('too many')) return BY_CODE.over_request_rate_limit
  if (message.includes('expired')) return BY_CODE.otp_expired
  if (message.includes('confirm') && message.includes('email')) return BY_CODE.email_not_confirmed
  if (message.includes('password') && (message.includes('weak') || message.includes('at least'))) return BY_CODE.weak_password
  return 'We couldn’t finish that. Please try again.'
}

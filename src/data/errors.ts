export type DataError = { code: 'validation' | 'auth' | 'conflict' | 'unavailable'; message: string }

export function mapDataError(error: { code?: string; message?: string } | null): DataError | null {
  if (!error) return null
  if (error.code === '42501' || error.code === 'PGRST301' || error.message?.toLowerCase().includes('jwt')) {
    return { code: 'auth', message: 'Sign in to keep this on your account.' }
  }
  if (error.code === '23505') return { code: 'conflict', message: 'That is already saved for today.' }
  if (error.code === '23514' || error.code === '22023') return { code: 'validation', message: 'That value is not allowed.' }
  return { code: 'unavailable', message: 'Could not save just now. It is still on this device.' }
}

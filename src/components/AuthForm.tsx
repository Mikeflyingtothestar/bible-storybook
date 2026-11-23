import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { friendlyAuthError } from '../auth/errors'
import { authRedirect } from '../lib/env'
import { supabase } from '../lib/supabase'
import { useAppTheme } from '../theme/ThemeProvider'
import { Wordmark } from './Motifs'
import { Button, Column, Field, Screen, ThemeSwitcher, Txt } from './ui'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const { colors } = useAppTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const title = mode === 'sign-in' ? 'Welcome back' : 'Create your account'

  async function withBusy(task: () => Promise<void>) {
    setBusy(true)
    setMessage(null)
    try {
      await task()
    } catch (error) {
      setMessage(friendlyAuthError(error instanceof Error ? { message: error.message } : null))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen testID={mode}>
      <Column width={480} style={{ paddingTop: 48, gap: 16 }}>
        <Link href="/" accessibilityLabel="Bible Storybook home">
          <Wordmark />
        </Link>
        <Txt size={36} weight={700} serif>
          {title}
        </Txt>
        <Txt color={colors.muted}>Use email, a magic link, or a provider button. Google and Apple work after they are enabled in Supabase.</Txt>
        <Field label="Email" value={email} onChangeText={setEmail} keyboard="email-address" testID="email" placeholder="you@example.com" />
        <Field label="Password" value={password} onChangeText={setPassword} secure testID="password" placeholder="At least 8 characters" />
        {message ? (
          <View testID="auth-message">
            <Txt color={colors.danger}>{message}</Txt>
          </View>
        ) : null}
        <Button
          label={busy ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
          disabled={busy}
          testID="submit-auth"
          onPress={() =>
            void withBusy(async () => {
              if (!email.includes('@') || password.length < 8) {
                setMessage('Enter a valid email and a password of at least 8 characters.')
                return
              }
              if (mode === 'sign-up') {
                const { data, error } = await supabase.auth.signUp({
                  email: email.trim(),
                  password,
                  options: { emailRedirectTo: authRedirect() },
                })
                if (error) return setMessage(friendlyAuthError(error))
                if (!data.session) {
                  router.push('/magic-link-sent')
                  return
                }
              } else {
                const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
                if (error) return setMessage(friendlyAuthError(error))
              }
              router.replace('/version')
            })
          }
        />
        <Button
          label="Email me a sign-in link"
          variant="quiet"
          disabled={busy}
          onPress={() =>
            void withBusy(async () => {
              const { error } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: { emailRedirectTo: authRedirect() },
              })
              if (error) return setMessage(friendlyAuthError(error))
              router.push('/magic-link-sent')
            })
          }
        />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Button label="Google" variant="quiet" onPress={() => void startOAuth('google', setMessage)} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Apple" variant="quiet" onPress={() => void startOAuth('apple', setMessage)} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          {mode === 'sign-in' ? (
            <Link href="/sign-up">
              <Txt weight={700} color={colors.accent}>
                Need an account?
              </Txt>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Txt weight={700} color={colors.accent}>
                Already have one?
              </Txt>
            </Link>
          )}
          <Link href="/forgot-password">
            <Txt weight={700} color={colors.accent}>
              Forgot password
            </Txt>
          </Link>
        </View>
        <ThemeSwitcher />
      </Column>
    </Screen>
  )
}

async function startOAuth(provider: 'google' | 'apple', setMessage: (value: string) => void) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: authRedirect(), skipBrowserRedirect: false },
  })
  if (error) setMessage(friendlyAuthError(error))
}

export function TextLink({ href, label }: { href: '/sign-in' | '/'; label: string }) {
  const { colors } = useAppTheme()
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}>
        <Txt weight={700} color={colors.accent}>
          {label}
        </Txt>
      </Pressable>
    </Link>
  )
}

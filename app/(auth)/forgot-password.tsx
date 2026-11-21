import { Link } from 'expo-router'
import { useState } from 'react'

import { friendlyAuthError } from '@/src/auth/errors'
import { Button, Column, Field, Screen, Txt } from '@/src/components/ui'
import { authRedirect } from '@/src/lib/env'
import { supabase } from '@/src/lib/supabase'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function ForgotPassword() {
  const { colors } = useAppTheme()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  return (
    <Screen>
      <Column width={480} style={{ paddingTop: 48, gap: 14 }}>
        <Txt size={36} weight={700} serif>
          Reset password
        </Txt>
        <Field label="Email" value={email} onChangeText={setEmail} keyboard="email-address" testID="reset-email" />
        {message ? <Txt color={colors.muted}>{message}</Txt> : null}
        <Button
          label="Send reset link"
          onPress={() => {
            void supabase.auth
              .resetPasswordForEmail(email.trim(), { redirectTo: `${authRedirect()}?type=recovery` })
              .then(({ error }) => {
                setMessage(error ? friendlyAuthError(error) : 'If the account exists, a reset link is on the way.')
              })
          }}
        />
        <Link href="/sign-in">
          <Txt weight={700} color={colors.accent}>
            Back to sign in
          </Txt>
        </Link>
      </Column>
    </Screen>
  )
}

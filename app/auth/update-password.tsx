import { useRouter } from 'expo-router'
import { useState } from 'react'

import { friendlyAuthError } from '@/src/auth/errors'
import { Button, Column, Field, Screen, Txt } from '@/src/components/ui'
import { supabase } from '@/src/lib/supabase'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function UpdatePassword() {
  const router = useRouter()
  const { colors } = useAppTheme()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  return (
    <Screen>
      <Column width={480} style={{ paddingTop: 48, gap: 14 }}>
        <Txt size={36} weight={700} serif>
          Choose a new password
        </Txt>
        <Field label="New password" value={password} onChangeText={setPassword} secure testID="new-password" />
        {message ? <Txt color={colors.danger}>{message}</Txt> : null}
        <Button
          label="Save password"
          onPress={() => {
            if (password.length < 8) {
              setMessage('Use at least 8 characters.')
              return
            }
            void supabase.auth.updateUser({ password }).then(({ error }) => {
              if (error) setMessage(friendlyAuthError(error))
              else router.replace('/home')
            })
          }}
        />
      </Column>
    </Screen>
  )
}

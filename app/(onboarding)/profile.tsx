import { useRouter } from 'expo-router'
import { useState } from 'react'

import { useAuth } from '@/src/auth/AuthProvider'
import { Button, Column, Field, Screen, Txt } from '@/src/components/ui'
import { supabase } from '@/src/lib/supabase'
import { usePrefs } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function ChooseName() {
  const router = useRouter()
  const { user } = useAuth()
  const { colors } = useAppTheme()
  const [name, setName] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const prefs = usePrefs()

  async function finish() {
    const displayName = name.trim().slice(0, 60)
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName || null,
          theme: prefs.theme,
          text_scale: prefs.textScale,
          default_version_code: prefs.versionCode,
        })
        .eq('id', user.id)
      if (error) {
        setMessage('We saved this on the device, and will try the profile again from Settings.')
      }
    }
    prefs.setOnboardingDone(true)
    router.replace('/home')
  }

  return (
    <Screen>
      <Column width={560} style={{ paddingTop: 48, gap: 16 }}>
        <Txt weight={700} color={colors.accent}>
          4 of 4
        </Txt>
        <Txt size={34} weight={700} serif>
          What should we call you?
        </Txt>
        <Txt color={colors.muted}>A first name is enough. You can leave this blank.</Txt>
        <Field label="Display name" value={name} onChangeText={setName} testID="display-name" />
        {message ? <Txt color={colors.muted}>{message}</Txt> : null}
        <Button label="Start reading" testID="finish-onboarding" onPress={() => void finish()} />
      </Column>
    </Screen>
  )
}

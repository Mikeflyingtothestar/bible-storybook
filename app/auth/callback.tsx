import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'

import { friendlyAuthError } from '@/src/auth/errors'
import { Column, Screen, Txt } from '@/src/components/ui'
import { supabase } from '@/src/lib/supabase'
import { usePrefs } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function AuthCallback() {
  const router = useRouter()
  const { colors } = useAppTheme()
  const onboardingDone = usePrefs((state) => state.onboardingDone)
  const [message, setMessage] = useState('Signing you in…')
  const search = typeof window === 'undefined' ? '' : window.location.search
  const params = new URLSearchParams(search)
  const errorDescription = params.get('error_description')
  const shown = errorDescription ? friendlyAuthError({ message: errorDescription }) : message

  useEffect(() => {
    if (errorDescription) return
    let active = true
    const current = new URLSearchParams(search)
    const recovery = current.get('type') === 'recovery'
    const code = current.get('code')
    const finish = (hasSession: boolean) => {
      if (!active) return
      if (recovery) {
        router.replace('/auth/update-password')
        return
      }
      if (hasSession) router.replace(onboardingDone ? '/home' : '/version')
      else setMessage('We could not find a session. Request a new link and try again.')
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.replace('/auth/update-password')
        return
      }
      if (session) finish(true)
    })

    void (async () => {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error && !error.message.toLowerCase().includes('code verifier')) {
          if (active) setMessage(friendlyAuthError(error))
        }
      }
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) finish(true)
      else {
        setTimeout(() => {
          void supabase.auth.getSession().then(({ data: later }) => finish(Boolean(later.session)))
        }, 600)
      }
    })()

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [errorDescription, onboardingDone, router, search])

  return (
    <Screen>
      <Column width={480} style={{ paddingTop: 80 }}>
        <Txt size={28} weight={700} serif color={colors.text}>
          {shown}
        </Txt>
      </Column>
    </Screen>
  )
}

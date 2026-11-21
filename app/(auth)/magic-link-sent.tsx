import { Link } from 'expo-router'

import { Column, Screen, Txt } from '@/src/components/ui'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function MagicLinkSent() {
  const { colors } = useAppTheme()
  return (
    <Screen>
      <Column width={520} style={{ paddingTop: 64, gap: 14 }}>
        <Txt size={36} weight={700} serif>
          Check your email
        </Txt>
        <Txt color={colors.muted}>
          If that address can receive mail, a link is on its way. It expires, and the free Supabase mailer only sends a couple of messages an hour until custom SMTP is added.
        </Txt>
        <Link href="/sign-in">
          <Txt weight={700} color={colors.accent}>
            Back to sign in
          </Txt>
        </Link>
      </Column>
    </Screen>
  )
}

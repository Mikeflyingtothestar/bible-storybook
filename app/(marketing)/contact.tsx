import { Link } from 'expo-router'
import { Pressable } from 'react-native'

import { Column, Screen, Txt } from '@/src/components/ui'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function ContactPage() {
  const { colors } = useAppTheme()
  return (
    <Screen>
      <Column width={720} style={{ paddingTop: 32, gap: 14 }}>
        <Link href="/" asChild>
          <Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}>
            <Txt weight={700} color={colors.accent}>
              Back
            </Txt>
          </Pressable>
        </Link>
        <Txt size={36} weight={700} serif>
          Contact
        </Txt>
        <Txt>There is no public inbox yet, and this page does not send a message.</Txt>
        <Txt color={colors.muted}>
          To download or delete an account, sign in and use Settings. A waitlist email is used only to say when a plan opens. It is not a support address.
        </Txt>
        <Link href="/privacy" asChild>
          <Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}>
            <Txt weight={700} color={colors.accent}>
              Privacy
            </Txt>
          </Pressable>
        </Link>
      </Column>
    </Screen>
  )
}

import { Link } from 'expo-router'
import { Pressable } from 'react-native'

import { Column, Screen, Txt } from '@/src/components/ui'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function TermsPage() {
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
          Terms
        </Txt>
        <Txt>
          Bible Storybook is a quiet practice with Scripture underneath. It is not a church, a denomination, a pastor, or a therapist, and it is not a substitute for local community or medical care. The companion quotes a bundled text and can be wrong.
        </Txt>
        <Txt>
          The streak describes days you opened the app. It is not a measure of faith, it does not go down to punish a missed day, and it is not compared with anyone else.
        </Txt>
        <Txt>
          Purchases are not available. Prices on the plans page are a waitlist, not an offer. Do not send payment details. Joining the waitlist does not start a subscription. When billing exists it will be monthly or annual, cancel anytime, with no weekly charge and no trial that turns into a bill.
        </Txt>
        <Txt>
          You keep your journal. Don’t use friend codes to bother someone, and don’t try to read another person’s private notes. The database rules are written to refuse that.
        </Txt>
        <Txt color={colors.muted}>These terms match the app as it is today. They will be reviewed again before any paid plan is turned on.</Txt>
      </Column>
    </Screen>
  )
}

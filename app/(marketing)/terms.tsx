import { Link } from 'expo-router'

import { Column, Screen, Txt } from '@/src/components/ui'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function TermsPage() {
  const { colors } = useAppTheme()
  return (
    <Screen>
      <Column width={720} style={{ paddingTop: 32, gap: 14 }}>
        <Link href="/">
          <Txt weight={700} color={colors.accent}>
            Back
          </Txt>
        </Link>
        <Txt size={36} weight={700} serif>
          Terms
        </Txt>
        <Txt>
          Bible Storybook is a reading app. It is not a church, a counsellor, or a substitute for local community. The reading journey describes days you spent with the text. It is not a measure of faith, and it is not compared with anyone else.
        </Txt>
        <Txt>
          Purchases are not available. Prices shown on the site are plans, not offers. Do not send payment details to this app.
        </Txt>
        <Txt>
          You keep your notes. Don’t use friend codes to bother someone, and don’t try to read another person’s private highlights. The database rules are written to refuse that.
        </Txt>
        <Txt color={colors.muted}>These terms describe the phase 1 website. They will be reviewed before any paid plan is turned on.</Txt>
      </Column>
    </Screen>
  )
}

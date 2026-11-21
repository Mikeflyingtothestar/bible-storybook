import { Link } from 'expo-router'

import { Column, Screen, Txt } from '@/src/components/ui'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function PrivacyPage() {
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
          Privacy
        </Txt>
        <Txt>
          Bible Storybook stores your account, reading sessions, bookmarks, highlights, notes, family membership, and bedtime settings in Supabase. Row-level security limits each person to their own rows. Friends and family see a streak, level, or activity only when you choose that audience.
        </Txt>
        <Txt>
          We do not sell personal information. There are no ads. Child profiles are not part of this version. When they arrive, a parent will create them, we will store a consent time, and a child will not have an email address, friends, or a place to type messages.
        </Txt>
        <Txt>
          You can download a copy of your reading data from Settings, and you can ask to delete the account. Deletion runs through the delete-account function once it is deployed; until then the button explains that the request could not be completed.
        </Txt>
        <Txt color={colors.muted}>Bible text from the World English Bible, Berean Standard Bible, and King James Version is public domain.</Txt>
      </Column>
    </Screen>
  )
}

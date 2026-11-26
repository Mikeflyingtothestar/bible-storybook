import { Link } from 'expo-router'
import { Pressable } from 'react-native'

import { Column, Screen, Txt } from '@/src/components/ui'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function PrivacyPage() {
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
          Privacy
        </Txt>
        <Txt>
          Bible Storybook keeps an account, reading sessions, bookmarks, highlights, notes, and family membership in Supabase. Row-level security limits each signed-in person to their own rows. Friends and family see a streak or activity only when you choose that audience.
        </Txt>
        <Txt>
          A journal line and a gratitude note are saved to your account only after you sign in and press save. Until then they stay in the browser tab. Mood, the days you opened, and a guest’s companion count stay on this device. They are not uploaded with the waitlist.
        </Txt>
        <Txt>
          The pricing waitlist stores the email you type and the plan name (monthly, annual, or family). That table accepts new rows and does not let the app read them back. The address is for one note when a plan opens. It is not sold, and it is not a mailing list.
        </Txt>
        <Txt>
          A signed-in companion stores how many questions you asked today, so the five-a-day limit holds if you switch devices. The wording of the question is not saved. Guest questions are counted only on this device.
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

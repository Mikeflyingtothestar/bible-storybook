import { Link } from 'expo-router'
import { Pressable, View } from 'react-native'

import { useAuth } from '@/src/auth/AuthProvider'
import { Dashboard } from '@/src/components/Dashboard'
import { AppBar, Column, Screen, Txt } from '@/src/components/ui'
import { supabase } from '@/src/lib/supabase'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function MeScreen() {
  const { user } = useAuth()
  const { colors } = useAppTheme()
  return (
    <Screen testID="me">
      <AppBar title="Me" />
      <Column width={860} style={{ gap: 16 }}>
        <Txt size={32} weight={700} serif>
          Your reading journey
        </Txt>
        <Dashboard />
        <View style={{ gap: 8 }}>
          <Nav href="/me/journey" label="Faith Journey" />
          <Nav href="/me/bookmarks" label="Bookmarks" />
          <Nav href="/me/highlights" label="Highlights and notes" />
          <Nav href="/me/settings" label="Settings" />
          <Nav href="/paywall" label="Plans" />
        </View>
        {user ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            onPress={() => void supabase.auth.signOut()}
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <Txt weight={700} color={colors.accent}>
              Sign out
            </Txt>
          </Pressable>
        ) : (
          <Link href="/sign-in">
            <Txt weight={700} color={colors.accent}>
              Sign in
            </Txt>
          </Link>
        )}
      </Column>
    </Screen>
  )
}

function Nav({ href, label }: { href: '/me/journey' | '/me/bookmarks' | '/me/highlights' | '/me/settings' | '/paywall'; label: string }) {
  const { colors } = useAppTheme()
  return (
    <Link href={href}>
      <Txt weight={700} color={colors.accent}>
        {label}
      </Txt>
    </Link>
  )
}

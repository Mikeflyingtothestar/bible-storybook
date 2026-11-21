import { Link } from 'expo-router'
import { useState } from 'react'
import { Platform, Pressable, View } from 'react-native'

import { useAuth } from '@/src/auth/AuthProvider'
import { AppBar, Button, Column, Field, Screen, ThemeSwitcher, Txt } from '@/src/components/ui'
import { VERSIONS, type VersionCode } from '@/src/bible/catalog'
import { supabase } from '@/src/lib/supabase'
import { usePrefs, type DailyGoal } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function SettingsScreen() {
  const { user } = useAuth()
  const { colors } = useAppTheme()
  const prefs = usePrefs()
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  async function saveProfile() {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({ theme: prefs.theme, text_scale: prefs.textScale, default_version_code: prefs.versionCode })
      .eq('id', user.id)
    setMessage(error ? 'The profile could not be updated.' : 'Saved to your profile.')
  }

  async function exportData() {
    if (!user) return
    const [bookmarks, highlights, sessions, profile] = await Promise.all([
      supabase.from('bookmarks').select('*').eq('user_id', user.id),
      supabase.from('highlights_notes').select('*').eq('user_id', user.id),
      supabase.from('reading_sessions').select('*').eq('user_id', user.id),
      supabase.from('profiles').select('display_name, theme, text_scale, default_version_code').eq('id', user.id).maybeSingle(),
    ])
    const payload = JSON.stringify({ profile: profile.data, bookmarks: bookmarks.data, highlights: highlights.data, sessions: sessions.data }, null, 2)
    if (Platform.OS === 'web') {
      const blob = new Blob([payload], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'bible-storybook-data.json'
      anchor.click()
      URL.revokeObjectURL(url)
    }
    setMessage('Your reading data is ready.')
  }

  async function deleteAccount() {
    if (confirm !== 'DELETE') {
      setMessage('Type DELETE to confirm.')
      return
    }
    const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' })
    setMessage(error ? 'Account deletion is not available until the delete-account function is deployed.' : 'Your account has been deleted.')
    if (!error) await supabase.auth.signOut()
  }

  return (
    <Screen>
      <AppBar title="Settings" backHref="/me" />
      <Column width={640} style={{ gap: 16 }}>
        <Txt weight={800}>Theme</Txt>
        <ThemeSwitcher />
        <Txt weight={800}>Text size {prefs.textScale.toFixed(2)}</Txt>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button label="Smaller" variant="quiet" onPress={() => prefs.setTextScale(Number((prefs.textScale - 0.25).toFixed(2)))} />
          <Button label="Larger" variant="quiet" onPress={() => prefs.setTextScale(Number((prefs.textScale + 0.25).toFixed(2)))} />
        </View>
        <Txt weight={800}>Bible</Txt>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {VERSIONS.map((item) => (
            <Pressable key={item.code} accessibilityRole="button" onPress={() => prefs.setVersionCode(item.code as VersionCode)} style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 999, justifyContent: 'center', backgroundColor: prefs.versionCode === item.code ? colors.accent : colors.surface }}>
              <Txt weight={700} color={prefs.versionCode === item.code ? colors.onAccent : colors.text}>
                {item.code}
              </Txt>
            </Pressable>
          ))}
        </View>
        <Txt weight={800}>Daily aim</Txt>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {([5, 10, 15] as DailyGoal[]).map((minutes) => (
            <Pressable key={minutes} accessibilityRole="button" onPress={() => prefs.setDailyGoalMin(minutes)} style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 999, justifyContent: 'center', backgroundColor: prefs.dailyGoalMin === minutes ? colors.accent : colors.surface }}>
              <Txt weight={700} color={prefs.dailyGoalMin === minutes ? colors.onAccent : colors.text}>
                {minutes} min
              </Txt>
            </Pressable>
          ))}
        </View>
        {user ? <Button label="Save to profile" onPress={() => void saveProfile()} /> : null}
        <Link href="/me/settings/privacy">
          <Txt weight={700} color={colors.accent}>
            Privacy
          </Txt>
        </Link>
        <Link href="/me/settings/voice">
          <Txt weight={700} color={colors.accent}>
            Voice
          </Txt>
        </Link>
        <Link href="/paywall">
          <Txt weight={700} color={colors.accent}>
            Subscription
          </Txt>
        </Link>
        {user ? <Button label="Download my data" variant="quiet" onPress={() => void exportData()} /> : null}
        {user ? (
          <>
            <Field label="Type DELETE to remove your account" value={confirm} onChangeText={setConfirm} testID="delete-confirm" />
            <Button label="Delete account" variant="danger" onPress={() => void deleteAccount()} />
          </>
        ) : null}
        {message ? <Txt>{message}</Txt> : null}
      </Column>
    </Screen>
  )
}

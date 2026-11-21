import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { useAuth } from '@/src/auth/AuthProvider'
import { AppBar, Button, Column, Screen, Txt } from '@/src/components/ui'
import { supabase } from '@/src/lib/supabase'
import { useAppTheme } from '@/src/theme/ThemeProvider'

type Audience = 'nobody' | 'family' | 'friends'
type Privacy = {
  show_streak_to: Audience
  show_level_to: Audience
  show_activity_to: Audience
  discoverable_by_code: boolean
}

const AUDIENCES: Audience[] = ['nobody', 'family', 'friends']

export default function PrivacySettings() {
  const { user } = useAuth()
  const { colors } = useAppTheme()
  const client = useQueryClient()
  const query = useQuery({
    queryKey: ['privacy', user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data } = await supabase.from('privacy_settings').select('*').eq('user_id', user?.id ?? '').maybeSingle()
      return data as Privacy | null
    },
  })
  const [draft, setDraft] = useState<Privacy | null>(null)
  const value = draft ?? query.data ?? null

  return (
    <Screen>
      <AppBar title="Privacy" backHref="/me/settings" />
      <Column width={640} style={{ gap: 14 }}>
        {!user ? <Txt>Sign in to change who can see your journey.</Txt> : null}
        {value ? (
          <>
            <Chooser label="Streak" value={value.show_streak_to} onChange={(show_streak_to) => setDraft({ ...value, show_streak_to })} />
            <Chooser label="Level" value={value.show_level_to} onChange={(show_level_to) => setDraft({ ...value, show_level_to })} />
            <Chooser label="Activity" value={value.show_activity_to} onChange={(show_activity_to) => setDraft({ ...value, show_activity_to })} />
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: value.discoverable_by_code }}
              onPress={() => setDraft({ ...value, discoverable_by_code: !value.discoverable_by_code })}
              style={{ minHeight: 48, justifyContent: 'center' }}
            >
              <Txt weight={700}>Discoverable by friend code: {value.discoverable_by_code ? 'yes' : 'no'}</Txt>
            </Pressable>
            <Button
              label="Save privacy"
              onPress={() => {
                void supabase
                  .from('privacy_settings')
                  .update(value)
                  .eq('user_id', user?.id ?? '')
                  .then(() => client.invalidateQueries({ queryKey: ['privacy', user?.id] }))
              }}
            />
          </>
        ) : null}
        <View>
          <Txt color={colors.muted}>The default is nobody. Family and friends only see what you allow.</Txt>
        </View>
      </Column>
    </Screen>
  )
}

function Chooser({ label, value, onChange }: { label: string; value: Audience; onChange: (value: Audience) => void }) {
  const { colors } = useAppTheme()
  return (
    <View style={{ gap: 6 }}>
      <Txt weight={800}>{label}</Txt>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {AUDIENCES.map((item) => (
          <Pressable key={item} accessibilityRole="radio" accessibilityState={{ selected: value === item }} onPress={() => onChange(item)} style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 999, justifyContent: 'center', backgroundColor: value === item ? colors.accent : colors.surface }}>
            <Txt weight={700} color={value === item ? colors.onAccent : colors.text}>
              {item}
            </Txt>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

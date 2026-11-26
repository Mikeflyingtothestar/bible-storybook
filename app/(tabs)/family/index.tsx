import { Link } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { useAuth } from '@/src/auth/AuthProvider'
import { AppBar, Button, Card, Column, Field, Screen, Txt } from '@/src/components/ui'
import { supabase } from '@/src/lib/supabase'
import { useAppTheme } from '@/src/theme/ThemeProvider'

const PRESETS = [
  { key: 'praying_for_you', label: 'Praying for you' },
  { key: 'well_done', label: 'Well done' },
  { key: 'keep_going', label: 'Keep going' },
  { key: 'read_together', label: 'Read together' },
  { key: 'god_bless', label: 'God bless' },
] as const

type FamilyRow = { id: string; name: string; invite_code: string; owner_id: string }
type Member = { user_id: string; role: string; profiles: { display_name: string | null } | null }

export default function FamilyScreen() {
  const { user } = useAuth()
  const { colors } = useAppTheme()
  const client = useQueryClient()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const family = useQuery({
    queryKey: ['family', user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data: memberships } = await supabase.from('family_members').select('family_id, role').eq('user_id', user?.id ?? '')
      const first = (memberships as { family_id: string; role: string }[] | null)?.[0]
      if (!first) return null
      const { data: group } = await supabase.from('families').select('id, name, invite_code, owner_id').eq('id', first.family_id).maybeSingle()
      const { data: members } = await supabase.from('family_members').select('user_id, role, profiles(display_name)').eq('family_id', first.family_id)
      return { group: group as FamilyRow | null, role: first.role, members: (members as unknown as Member[]) ?? [] }
    },
  })

  if (!user) {
    return (
      <Screen>
        <AppBar title="Family" />
        <Column>
          <Txt>Sign in to create a family or join one with a code.</Txt>
          <Link href="/sign-in" asChild>
            <Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}>
              <Txt weight={700} color={colors.accent}>
                Sign in
              </Txt>
            </Pressable>
          </Link>
        </Column>
      </Screen>
    )
  }

  async function refresh() {
    await client.invalidateQueries({ queryKey: ['family', user?.id] })
  }

  return (
    <Screen>
      <AppBar title="Family" />
      <Column width={720} style={{ gap: 14 }}>
        <Link href="/family/friends" asChild>
          <Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}>
            <Txt weight={700} color={colors.accent}>
              Friends
            </Txt>
          </Pressable>
        </Link>
        <Txt color={colors.muted}>Each person keeps their own reading and journal. A family plan simply gathers those profiles in one home.</Txt>
        {message ? <Txt color={colors.muted}>{message}</Txt> : null}
        {!family.data?.group ? (
          <Card>
            <Txt weight={800}>Start a family</Txt>
            <Field label="Family name" value={name} onChangeText={setName} testID="family-name" />
            <Button
              label="Create family"
              onPress={() => {
                void supabase
                  .from('families')
                  .insert({ name: name.trim().slice(0, 60) || 'Our family' })
                  .select('id')
                  .single()
                  .then(({ error }) => {
                    setMessage(error ? 'A family could not be created.' : 'Family created.')
                    void refresh()
                  })
              }}
            />
            <Field label="Join with a code" value={code} onChangeText={setCode} testID="family-code" />
            <Button
              label="Join"
              variant="quiet"
              onPress={() => {
                void supabase.rpc('join_family', { code: code.trim() }).then(({ error }) => {
                  setMessage(error ? error.message : 'You joined the family.')
                  void refresh()
                })
              }}
            />
          </Card>
        ) : (
          <Card>
            <Txt size={24} weight={800}>
              {family.data.group.name}
            </Txt>
            <Txt color={colors.muted}>Invite code {family.data.group.invite_code}</Txt>
            {family.data.members.map((member) => (
              <View key={member.user_id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 }}>
                <Txt>
                  {member.profiles?.display_name || 'Member'} · {member.role}
                </Txt>
                {family.data?.group?.owner_id === user.id && member.role !== 'owner' ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Remove member"
                    style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}
                    onPress={() => {
                      void supabase
                        .from('family_members')
                        .delete()
                        .eq('family_id', family.data?.group?.id ?? '')
                        .eq('user_id', member.user_id)
                        .then(() => refresh())
                    }}
                  >
                    <Txt color={colors.danger}>Remove</Txt>
                  </Pressable>
                ) : null}
              </View>
            ))}
            <Txt weight={800}>Encouragement</Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {PRESETS.map((preset) => (
                <Pressable
                  key={preset.key}
                  accessibilityRole="button"
                  accessibilityLabel={preset.label}
                  onPress={() => {
                    const other = family.data?.members.find((member) => member.user_id !== user.id)
                    if (!other) {
                      setMessage('Invite someone before sending an encouragement.')
                      return
                    }
                    void supabase
                      .from('encouragements')
                      .insert({ recipient_id: other.user_id, preset_key: preset.key })
                      .then(({ error }) => setMessage(error ? 'That could not be sent.' : `Sent “${preset.label}”.`))
                  }}
                  style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 999, backgroundColor: colors.bg, justifyContent: 'center' }}
                >
                  <Txt weight={700}>{preset.label}</Txt>
                </Pressable>
              ))}
            </View>
          </Card>
        )}
        <Txt color={colors.muted}>Child profiles arrive in the next update. There is no free-text chat.</Txt>
      </Column>
    </Screen>
  )
}

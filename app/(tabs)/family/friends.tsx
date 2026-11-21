import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { useAuth } from '@/src/auth/AuthProvider'
import { AppBar, Button, Card, Column, Field, Screen, Txt } from '@/src/components/ui'
import { supabase } from '@/src/lib/supabase'
import { useAppTheme } from '@/src/theme/ThemeProvider'

type Friendship = { id: string; requester_id: string; addressee_id: string; status: string }
type Profile = { id: string; display_name: string | null; friend_code: string }

export default function FriendsScreen() {
  const { user } = useAuth()
  const { colors } = useAppTheme()
  const client = useQueryClient()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const me = useQuery({
    queryKey: ['me-profile', user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('id, display_name, friend_code').eq('id', user?.id ?? '').maybeSingle()
      return data as Profile | null
    },
  })
  const friends = useQuery({
    queryKey: ['friends', user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data } = await supabase.from('friendships').select('id, requester_id, addressee_id, status')
      return (data as Friendship[] | null) ?? []
    },
  })

  if (!user) {
    return (
      <Screen>
        <AppBar title="Friends" backHref="/family" />
        <Column>
          <Txt>Sign in to share your friend code.</Txt>
        </Column>
      </Screen>
    )
  }

  async function refresh() {
    await client.invalidateQueries({ queryKey: ['friends', user?.id] })
  }

  return (
    <Screen>
      <AppBar title="Friends" backHref="/family" />
      <Column width={720} style={{ gap: 12 }}>
        <Card>
          <Txt weight={800}>Your code</Txt>
          <View testID="friend-code">
            <Txt size={28} weight={800}>{me.data?.friend_code ?? '…'}</Txt>
          </View>
          <Txt color={colors.muted}>Someone can add you only if you allow discovery in Privacy.</Txt>
        </Card>
        <Field label="Add by code" value={code} onChangeText={setCode} testID="friend-code-input" />
        <Button
          label="Send request"
          onPress={() => {
            void supabase.rpc('request_friend', { code: code.trim() }).then(({ error }) => {
              setMessage(error ? friendlyFriendError(error.message) : 'Request sent.')
              void refresh()
            })
          }}
        />
        {message ? <Txt>{message}</Txt> : null}
        {(friends.data ?? []).map((row) => {
          const incoming = row.addressee_id === user.id && row.status === 'pending'
          return (
            <Card key={row.id}>
              <Txt weight={700}>{row.status === 'accepted' ? 'Friend' : incoming ? 'Request for you' : 'Request sent'}</Txt>
              {incoming ? (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable accessibilityRole="button" accessibilityLabel="Accept" onPress={() => void update(row.id, 'accepted', refresh)} style={pill(colors.accent)}>
                    <Txt color={colors.onAccent} weight={700}>
                      Accept
                    </Txt>
                  </Pressable>
                  <Pressable accessibilityRole="button" accessibilityLabel="Decline" onPress={() => void remove(row.id, refresh)}>
                    <Txt weight={700}>Decline</Txt>
                  </Pressable>
                  <Pressable accessibilityRole="button" accessibilityLabel="Block" onPress={() => void update(row.id, 'blocked', refresh)}>
                    <Txt color={colors.danger} weight={700}>
                      Block
                    </Txt>
                  </Pressable>
                </View>
              ) : null}
            </Card>
          )
        })}
      </Column>
    </Screen>
  )
}

function pill(background: string) {
  return { minHeight: 44, paddingHorizontal: 12, borderRadius: 12, backgroundColor: background, justifyContent: 'center' as const }
}

function friendlyFriendError(message: string): string {
  if (message.includes('not found')) return 'That code was not found.'
  if (message.includes('child')) return 'Child accounts cannot add friends.'
  return 'The request could not be sent.'
}

async function update(id: string, status: 'accepted' | 'blocked', refresh: () => Promise<void>) {
  await supabase.from('friendships').update({ status, responded_at: new Date().toISOString() }).eq('id', id)
  await refresh()
}

async function remove(id: string, refresh: () => Promise<void>) {
  await supabase.from('friendships').delete().eq('id', id)
  await refresh()
}

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

import { useAuth } from '@/src/auth/AuthProvider'
import { AppBar, Card, Column, Screen, Txt } from '@/src/components/ui'
import { supabase } from '@/src/lib/supabase'
import { useAppTheme } from '@/src/theme/ThemeProvider'

type Row = { id: string; color: string | null; note: string | null; verses: { osis_ref: string; text: string } | null }

export default function HighlightsScreen() {
  const { user } = useAuth()
  const { colors } = useAppTheme()
  const router = useRouter()
  const query = useQuery({
    queryKey: ['highlights', user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data } = await supabase.from('highlights_notes').select('id, color, note, verses(osis_ref, text)').order('created_at', { ascending: false })
      return (data as unknown as Row[]) ?? []
    },
  })
  return (
    <Screen>
      <AppBar title="Highlights" backHref="/me" />
      <Column width={720} style={{ gap: 10 }}>
        {!user ? <Txt>Sign in to see highlights and notes.</Txt> : null}
        {(query.data ?? []).map((row) => {
          const [book, chapter] = row.verses?.osis_ref.split('.') ?? []
          return (
            <Pressable key={row.id} accessibilityRole="button" onPress={() => book && router.push(`/bible/${book}/${chapter}`)}>
              <Card>
                <Txt weight={800}>{row.verses?.osis_ref}</Txt>
                <Txt>{row.verses?.text}</Txt>
                {row.note ? <Txt color={colors.muted}>{row.note}</Txt> : null}
                <Txt size={13} color={colors.muted}>
                  {row.color}
                </Txt>
              </Card>
            </Pressable>
          )
        })}
      </Column>
    </Screen>
  )
}

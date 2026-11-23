import { useQuery } from '@tanstack/react-query'
import { View } from 'react-native'

import { useAuth } from '../auth/AuthProvider'
import { levelForPoints } from '../progress/journey'
import { supabase } from '../lib/supabase'
import { usePrefs } from '../preferences/store'
import { useAppTheme } from '../theme/ThemeProvider'
import { Card, Txt } from './ui'

type Progress = {
  current_streak: number
  longest_streak: number
  grace_days_left: number
  journey_points: number
  journey_level: number
  total_seconds: number
  chapters_completed: number
  stories_completed: number
}

type SessionRow = { local_date: string; seconds_active: number }

function lastSeven(timeZone: string): string[] {
  const days: string[] = []
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(Date.now() - offset * 86_400_000)
    days.push(new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date))
  }
  return days
}

export function Dashboard() {
  const { user } = useAuth()
  const { colors } = useAppTheme()
  const goal = usePrefs((state) => state.dailyGoalMin)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  const progress = useQuery({
    queryKey: ['progress', user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      await supabase.rpc('recompute_my_progress', { tz: timeZone })
      const { data } = await supabase.from('user_progress').select('*').eq('user_id', user?.id ?? '').maybeSingle()
      return (data as Progress | null) ?? null
    },
  })
  const week = useQuery({
    queryKey: ['week', user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const days = lastSeven(timeZone)
      const { data } = await supabase.from('reading_sessions').select('local_date, seconds_active').gte('local_date', days[0] ?? '').eq('user_id', user?.id ?? '')
      const rows = (data as SessionRow[] | null) ?? []
      return days.map((day) => ({
        day,
        minutes: rows.filter((row) => row.local_date === day).reduce((sum, row) => sum + row.seconds_active, 0) / 60,
      }))
    },
  })

  const row = progress.data
  const points = row?.journey_points ?? 0
  const level = levelForPoints(points)
  const today = week.data?.[6]?.minutes ?? 0
  const max = Math.max(goal, ...(week.data?.map((item) => item.minutes) ?? [1]))

  return (
    <View style={{ gap: 12 }} testID="dashboard">
      {!user ? <Txt color={colors.muted}>Sign in to keep this journey. Until then the cards stay at zero.</Txt> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <Stat label="Today" value={`${Math.round(today)} min`} detail={`Aim ${goal} min`} />
        <Stat label="Current streak" value={`${row?.current_streak ?? 0} days`} detail={`${row?.grace_days_left ?? 2} grace days left`} />
        <Stat label="Longest streak" value={`${row?.longest_streak ?? 0} days`} detail="Your reading journey" />
        <Stat label="Chapters finished" value={String(row?.chapters_completed ?? 0)} detail={`${row?.stories_completed ?? 0} stories`} />
      </View>
      <Card>
        <Txt weight={800}>This week</Txt>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 120 }}>
          {(week.data ?? lastSeven(timeZone).map((day) => ({ day, minutes: 0 }))).map((item) => (
            <View key={item.day} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
              <View style={{ height: 80, width: '100%', justifyContent: 'flex-end' }}>
                <View style={{ height: Math.max(4, (item.minutes / max) * 80), backgroundColor: colors.accent, borderRadius: 8 }} />
              </View>
              <Txt size={12} color={colors.muted}>
                {item.day.slice(8)}
              </Txt>
            </View>
          ))}
        </View>
      </Card>
      <Card>
        <Txt size={14} weight={800} color={colors.goldText}>
          Faith Journey
        </Txt>
        <Txt size={24} weight={800}>
          {level.current.name}
        </Txt>
        <Txt color={colors.muted}>{level.current.meaning}</Txt>
        <View style={{ height: 10, borderRadius: 99, backgroundColor: colors.bg, overflow: 'hidden' }}>
          <View
            style={{
              height: 10,
              width: `${level.next ? Math.min(100, ((points - level.current.minPoints) / (level.next.minPoints - level.current.minPoints)) * 100) : 100}%`,
              backgroundColor: colors.gold,
            }}
          />
        </View>
        <Txt color={colors.muted}>
          {level.next ? `${points} of ${level.next.minPoints} toward ${level.next.name}` : `${points} points. This is the furthest level.`}
        </Txt>
      </Card>
    </View>
  )
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  const { colors } = useAppTheme()
  return (
    <Card style={{ minWidth: 200, flexBasis: '46%', flexGrow: 1, borderTopWidth: 3, borderTopColor: colors.accent }}>
      <Txt size={13} weight={700} color={colors.muted} style={{ letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Txt>
      <Txt size={32} weight={700} serif>
        {value}
      </Txt>
      <Txt color={colors.muted}>{detail}</Txt>
    </Card>
  )
}

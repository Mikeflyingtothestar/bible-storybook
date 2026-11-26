import { useState } from 'react'
import { Pressable, TextInput } from 'react-native'

import { useAuth } from '@/src/auth/AuthProvider'
import { usePrefs } from '@/src/preferences/store'
import { AppBar, Button, Card, Column, Screen, Txt, fontSans } from '@/src/components/ui'
import { saveGratitude, saveJournal } from '@/src/data/wellness'
import { gratitudeStreak, streakMessage } from '@/src/journal/streak'
import { dayKey } from '@/src/teachings/daily'
import { useAppTheme } from '@/src/theme/ThemeProvider'

const PROMPTS = [
  'What is one small good thing from today?',
  'Who was kind, even briefly?',
  'Where did you have a quiet breath?',
  'What can you leave until tomorrow?',
  'What ordinary thing kept you going?',
  'What would you thank someone for?',
  'What felt like enough?',
]

export default function JournalScreen() {
  const { colors } = useAppTheme()
  const { user } = useAuth()
  const [gratitude, setGratitude] = useState('')
  const [examen, setExamen] = useState('')
  const [showExamen, setShowExamen] = useState(false)
  const [dates, setDates] = useState<string[]>([])
  const [note, setNote] = useState<string | null>(null)
  const mood = usePrefs((state) => state.mood)
  const day = dayKey(new Date())
  const prompt = PROMPTS[Number(day.slice(-2)) % PROMPTS.length] ?? PROMPTS[0]

  async function save() {
    const local = gratitude.trim() ? (dates.includes(day) ? dates : [...dates, day]) : dates
    setDates(local)
    if (!user) {
      setNote('Kept here for now. Sign in when you want it private on your account. A missed day does not scold you.')
      return
    }
    if (gratitude.trim()) await saveGratitude(user.id, gratitude, day)
    const body = [gratitude.trim() && `Gratitude: ${gratitude.trim()}`, examen.trim() && `Examen: ${examen.trim()}`].filter(Boolean).join('\n')
    const saved = body ? await saveJournal(user.id, body) : { error: null }
    setNote(saved.error?.message ?? 'Saved privately to your account.')
  }

  return (
    <Screen testID="journal">
      <AppBar title="Journal" />
      <Column width={680} style={{ gap: 16 }}>
        <Txt size={34} weight={700} serif>
          A private page
        </Txt>
        <Txt color={colors.muted}>{streakMessage(gratitudeStreak(dates, day))}</Txt>
        {mood ? <Txt weight={700}>Mood · {mood}</Txt> : null}
        <Card>
          <Txt weight={700}>{prompt}</Txt>
          <TextInput accessibilityLabel="Gratitude" value={gratitude} onChangeText={setGratitude} multiline placeholder="A few words is enough" placeholderTextColor={colors.muted} style={{ minHeight: 96, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, color: colors.text, fontFamily: fontSans(), textAlignVertical: 'top' }} />
        </Card>
        <Pressable accessibilityRole="button" onPress={() => setShowExamen((value) => !value)} style={{ minHeight: 44, justifyContent: 'center' }}>
          <Txt weight={700} color={colors.accent}>{showExamen ? 'Hide nightly examen' : 'Add an optional nightly examen'}</Txt>
        </Pressable>
        {showExamen ? (
          <Card>
            <Txt color={colors.muted}>Where did you feel close to peace, and where did you rush? Skip this if the day was full.</Txt>
            <TextInput accessibilityLabel="Nightly examen" value={examen} onChangeText={setExamen} multiline placeholderTextColor={colors.muted} style={{ minHeight: 96, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, color: colors.text, fontFamily: fontSans(), textAlignVertical: 'top' }} />
          </Card>
        ) : null}
        <Button label="Save" onPress={() => void save()} />
        {note ? <Txt>{note}</Txt> : null}
      </Column>
    </Screen>
  )
}

import { useState } from 'react'
import { Platform, Pressable, TextInput, View } from 'react-native'

import { useAuth } from '@/src/auth/AuthProvider'
import { AppBar, Card, Column, Screen, Txt, fontSans } from '@/src/components/ui'
import { savePrayerReminder } from '@/src/data/wellness'
import { usePrefs } from '@/src/preferences/store'
import { PRAYERS } from '@/src/prayer/catalog'
import { InAppReminder } from '@/src/prayer/InAppReminder'
import { syncPrayerReminder } from '@/src/prayer/notify'
import { IN_APP_REMINDER_COPY, parseRemindTime, reminderChannel } from '@/src/prayer/reminders'
import { useAppTheme } from '@/src/theme/ThemeProvider'
import { speakText, stopSpeaking } from '@/src/voice/speak'

const LENGTHS = [2, 5, 10] as const

export default function PrayScreen() {
  const { colors } = useAppTheme()
  const { user } = useAuth()
  const morningTime = usePrefs((state) => state.morningTime)
  const eveningTime = usePrefs((state) => state.eveningTime)
  const morningOn = usePrefs((state) => state.morningReminder)
  const eveningOn = usePrefs((state) => state.eveningReminder)
  const minutes = usePrefs((state) => state.prayerMinutes)
  const setMorningTime = usePrefs((state) => state.setMorningTime)
  const setEveningTime = usePrefs((state) => state.setEveningTime)
  const setMorningOn = usePrefs((state) => state.setMorningReminder)
  const setEveningOn = usePrefs((state) => state.setEveningReminder)
  const setMinutes = usePrefs((state) => state.setPrayerMinutes)
  const markToday = usePrefs((state) => state.markToday)
  const morning = PRAYERS.find((prayer) => prayer.id === 'morning-light')
  const night = PRAYERS.find((prayer) => prayer.id === 'evening-rest')
  const [note, setNote] = useState<string | null>(null)

  function saveTime(kind: 'morning' | 'evening', value: string) {
    const parsed = parseRemindTime(value)
    if (!parsed) {
      setNote('Use a 24-hour time, such as 07:30 or 21:00.')
      return
    }
    if (kind === 'morning') setMorningTime(parsed)
    else setEveningTime(parsed)
    const enabled = kind === 'morning' ? morningOn : eveningOn
    if (enabled) {
      void syncPrayerReminder(kind, true, parsed).then(async (result) => {
        setNote(result.message)
        if (result.ok && user) await savePrayerReminder(user.id, kind, true, parsed)
      })
      return
    }
    setNote(reminderChannel(Platform.OS) === 'in-app' ? 'Time saved on this device. ' + IN_APP_REMINDER_COPY : 'Time saved on this phone.')
  }

  function toggle(kind: 'morning' | 'evening') {
    const next = kind === 'morning' ? !morningOn : !eveningOn
    const time = kind === 'morning' ? morningTime : eveningTime
    if (kind === 'morning') setMorningOn(next)
    else setEveningOn(next)
    void syncPrayerReminder(kind, next, time).then(async (result) => {
      if (!result.ok) {
        if (kind === 'morning') setMorningOn(false)
        else setEveningOn(false)
      }
      setNote(result.message)
      if (result.ok && user) await savePrayerReminder(user.id, kind, next, time)
    })
  }

  function listen(title: string, body: string, verse: string) {
    const script = minutes === 2 ? body : minutes === 5 ? `${body} ${verse}` : `${title}. ${body} ${verse} Rest here for a moment.`
    speakText(script, minutes === 2 ? 1 : 0.9)
    markToday(new Date().toISOString().slice(0, 10), 'prayer')
  }

  return (
    <Screen testID="pray">
      <AppBar title="Pray" />
      <Column width={720} style={{ gap: 16 }}>
        <Txt size={34} weight={700} serif>
          Morning and night
        </Txt>
        <Txt color={colors.muted}>Set your own times. Pick 2, 5 or 10 minutes. Nothing is billed weekly. {reminderChannel(Platform.OS) === 'in-app' ? IN_APP_REMINDER_COPY : 'A reminder asks this phone for permission only when you turn it on.'}</Txt>
        <InAppReminder slot="morning" enabled={morningOn} time={morningTime} />
        <InAppReminder slot="evening" enabled={eveningOn} time={eveningTime} />
        <ReminderSwitch label="Morning reminder" on={morningOn} onPress={() => toggle('morning')} />
        <ReminderSwitch label="Evening reminder" on={eveningOn} onPress={() => toggle('evening')} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {LENGTHS.map((length) => (
            <Pressable key={length} accessibilityRole="button" accessibilityLabel={`${length} minutes`} onPress={() => setMinutes(length)} style={{ minHeight: 44, paddingHorizontal: 16, borderRadius: 999, justifyContent: 'center', backgroundColor: minutes === length ? colors.accent : colors.surface }}>
              <Txt weight={700} color={minutes === length ? colors.onAccent : colors.text}>{length} min</Txt>
            </Pressable>
          ))}
          <Pressable accessibilityRole="button" accessibilityLabel="Stop prayer audio" onPress={stopSpeaking} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}>
            <Txt weight={700} color={colors.accent}>Stop</Txt>
          </Pressable>
        </View>
        <PrayerCard title="Morning" time={morningTime} onTime={(value) => saveTime('morning', value)} body={morning?.body ?? ''} verse={`${morning?.verse.label}. ${morning?.verse.text}`} onListen={() => listen('Morning', morning?.body ?? '', morning?.verse.text ?? '')} />
        <PrayerCard title="Night" time={eveningTime} onTime={(value) => saveTime('evening', value)} body={night?.body ?? ''} verse={`${night?.verse.label}. ${night?.verse.text}`} onListen={() => listen('Night', night?.body ?? '', night?.verse.text ?? '')} />
        {note ? <Txt>{note}</Txt> : null}
      </Column>
    </Screen>
  )
}

function ReminderSwitch({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  const { colors } = useAppTheme()
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: on }} accessibilityLabel={label} onPress={onPress} style={{ minHeight: 48, borderRadius: 14, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: on ? colors.accent : colors.surface }}>
      <Txt weight={700} color={on ? colors.onAccent : colors.text}>{on ? `${label} on` : label}</Txt>
    </Pressable>
  )
}

function PrayerCard({ title, time, onTime, body, verse, onListen }: { title: string; time: string; onTime: (value: string) => void; body: string; verse: string; onListen: () => void }) {
  const { colors } = useAppTheme()
  const [draft, setDraft] = useState(time)
  return (
    <Card>
      <Txt size={24} weight={700} serif>{title}</Txt>
      <Txt>{body}</Txt>
      <Txt color={colors.muted}>{verse}</Txt>
      <TextInput accessibilityLabel={`${title} time`} value={draft} onChangeText={setDraft} onEndEditing={() => onTime(draft)} style={{ minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, color: colors.text, fontFamily: fontSans() }} />
      <Pressable accessibilityRole="button" accessibilityLabel={`Listen to the ${title} prayer`} onPress={onListen} style={{ minHeight: 48, borderRadius: 999, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
        <Txt weight={700} color={colors.onAccent}>Listen</Txt>
      </Pressable>
    </Card>
  )
}

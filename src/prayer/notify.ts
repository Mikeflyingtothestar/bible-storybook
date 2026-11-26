import { Platform } from 'react-native'

import { IN_APP_REMINDER_COPY, parseRemindTime, type ReminderSlot } from './reminders'

const IDS: Record<'morning' | 'evening', string> = {
  morning: 'prayer-morning',
  evening: 'prayer-evening',
}

let handlerReady = false

export type ReminderSync = { ok: boolean; message: string }

/**
 * Schedules a daily local notification on iOS and Android.
 * Permission is requested only when a slot is turned on.
 * The website does not ask, and does not schedule anything.
 */
export async function syncPrayerReminder(slot: 'morning' | 'evening', enabled: boolean, hhmm: string): Promise<ReminderSync> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return {
      ok: true,
      message: enabled ? IN_APP_REMINDER_COPY : 'Reminder off. Nothing is scheduled in the browser.',
    }
  }
  const Notifications = await import('expo-notifications')
  if (!enabled) {
    await Notifications.cancelScheduledNotificationAsync(IDS[slot]).catch(() => undefined)
    return { ok: true, message: 'Reminder off.' }
  }
  const parsed = parseRemindTime(hhmm)
  if (!parsed) return { ok: false, message: 'Use a 24-hour time, such as 07:30.' }
  const current = await Notifications.getPermissionsAsync()
  let status = current.status
  if (status !== 'granted') {
    const asked = await Notifications.requestPermissionsAsync()
    status = asked.status
  }
  if (status !== 'granted') return { ok: false, message: 'Notifications stay off until you allow them on this phone.' }
  if (!handlerReady) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    })
    handlerReady = true
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('prayer', {
      name: 'Prayer',
      importance: Notifications.AndroidImportance.DEFAULT,
    })
  }
  await Notifications.cancelScheduledNotificationAsync(IDS[slot]).catch(() => undefined)
  const [hour, minute] = parsed.split(':').map(Number)
  await Notifications.scheduleNotificationAsync({
    identifier: IDS[slot],
    content: {
      title: slot === 'morning' ? 'A quiet morning' : 'A quiet evening',
      body: slot === 'morning' ? 'A short prayer is ready when you are.' : 'The day can close. A short prayer is here if you want it.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hour ?? 7,
      minute: minute ?? 0,
      channelId: 'prayer',
    },
  })
  return { ok: true, message: `This phone will remind you at ${parsed}.` }
}

export type PrayerSlot = Extract<ReminderSlot, 'morning' | 'evening'>

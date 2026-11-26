import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { VersionCode } from '../bible/catalog'
import type { ThemePreference } from '../theme/tokens'

export type DailyGoal = 5 | 10 | 15
export type Intention = 'sleep' | 'stress' | 'grief' | 'growth' | 'family'

export type TodayChecks = {
  day: string
  verse: boolean
  teaching: boolean
  prayer: boolean
  journal: boolean
}

export type LastPosition = {
  version: VersionCode
  book: string
  chapter: number
}

type Preferences = {
  theme: ThemePreference
  textScale: number
  versionCode: VersionCode
  dailyGoalMin: DailyGoal
  onboardingDone: boolean
  lastPosition: LastPosition | null
  intentions: Intention[]
  today: TodayChecks
  openedDays: string[]
  likedVerse: string | null
  eveningReminder: boolean
  morningReminder: boolean
  morningFired: string
  eveningFired: string
  preferredTime: 'morning' | 'evening' | 'flexible'
  morningTime: string
  eveningTime: string
  prayerMinutes: 2 | 5 | 10
  mood: 'calm' | 'grateful' | 'anxious' | 'sad' | 'tired' | 'hopeful' | null
  companionDay: string
  companionCount: number
  setTheme: (theme: ThemePreference) => void
  setTextScale: (textScale: number) => void
  setVersionCode: (versionCode: VersionCode) => void
  setDailyGoalMin: (dailyGoalMin: DailyGoal) => void
  setOnboardingDone: (onboardingDone: boolean) => void
  setLastPosition: (lastPosition: LastPosition) => void
  setIntentions: (intentions: Intention[]) => void
  toggleIntention: (intention: Intention) => void
  markToday: (day: string, key: 'verse' | 'teaching' | 'prayer' | 'journal') => void
  markOpened: (day: string) => void
  setLikedVerse: (likedVerse: string | null) => void
  setEveningReminder: (eveningReminder: boolean) => void
  setMorningReminder: (morningReminder: boolean) => void
  markReminderFired: (slot: 'morning' | 'evening', day: string) => void
  setPreferredTime: (preferredTime: 'morning' | 'evening' | 'flexible') => void
  setMorningTime: (morningTime: string) => void
  setEveningTime: (eveningTime: string) => void
  setPrayerMinutes: (prayerMinutes: 2 | 5 | 10) => void
  setMood: (mood: Preferences['mood']) => void
  noteCompanionAsk: (day: string) => void
}

const memory = new Map<string, string>()
const memoryStorage = {
  getItem: async (key: string) => memory.get(key) ?? null,
  setItem: async (key: string, value: string) => {
    memory.set(key, value)
  },
  removeItem: async (key: string) => {
    memory.delete(key)
  },
}

const webStorage = {
  getItem: async (key: string) => localStorage.getItem(key),
  setItem: async (key: string, value: string) => {
    localStorage.setItem(key, value)
  },
  removeItem: async (key: string) => {
    localStorage.removeItem(key)
  },
}

function storage() {
  if (typeof window === 'undefined') return memoryStorage
  if (Platform.OS === 'web') return webStorage
  return AsyncStorage
}

export const usePrefs = create<Preferences>()(
  persist(
    (set) => ({
      theme: 'system',
      textScale: 1,
      versionCode: 'WEB',
      dailyGoalMin: 10,
      onboardingDone: false,
      lastPosition: null,
      intentions: [],
      today: { day: '', verse: false, teaching: false, prayer: false, journal: false },
      openedDays: [],
      likedVerse: null,
      eveningReminder: false,
      morningReminder: false,
      morningFired: '',
      eveningFired: '',
      preferredTime: 'flexible',
      morningTime: '07:30',
      eveningTime: '21:00',
      prayerMinutes: 5,
      mood: null,
      companionDay: '',
      companionCount: 0,
      setTheme: (theme) => set({ theme }),
      setTextScale: (textScale) => set({ textScale: Math.min(2, Math.max(0.75, textScale)) }),
      setVersionCode: (versionCode) => set({ versionCode }),
      setDailyGoalMin: (dailyGoalMin) => set({ dailyGoalMin }),
      setOnboardingDone: (onboardingDone) => set({ onboardingDone }),
      setLastPosition: (lastPosition) => set({ lastPosition }),
      setIntentions: (intentions) => set({ intentions }),
      toggleIntention: (intention) =>
        set((state) => ({
          intentions: state.intentions.includes(intention)
            ? state.intentions.filter((item) => item !== intention)
            : [...state.intentions, intention],
        })),
      markToday: (day, key) =>
        set((state) => {
          const base = state.today.day === day ? state.today : { day, verse: false, teaching: false, prayer: false, journal: false }
          return { today: { ...base, day, [key]: true } }
        }),
      markOpened: (day) => set((state) => ({ openedDays: state.openedDays.includes(day) ? state.openedDays : [...state.openedDays, day].slice(-400) })),
      setLikedVerse: (likedVerse) => set({ likedVerse }),
      setEveningReminder: (eveningReminder) => set({ eveningReminder }),
      setMorningReminder: (morningReminder) => set({ morningReminder }),
      markReminderFired: (slot, day) => set(slot === 'morning' ? { morningFired: day } : { eveningFired: day }),
      setPreferredTime: (preferredTime) => set({ preferredTime }),
      setMorningTime: (morningTime) => set({ morningTime }),
      setEveningTime: (eveningTime) => set({ eveningTime }),
      setPrayerMinutes: (prayerMinutes) => set({ prayerMinutes }),
      setMood: (mood) => set({ mood }),
      noteCompanionAsk: (day) =>
        set((state) => ({
          companionDay: day,
          companionCount: state.companionDay === day ? state.companionCount + 1 : 1,
        })),
    }),
    {
      name: 'bible-storybook-prefs',
      storage: createJSONStorage(storage),
      partialize: (state) => ({
        theme: state.theme,
        textScale: state.textScale,
        versionCode: state.versionCode,
        dailyGoalMin: state.dailyGoalMin,
        onboardingDone: state.onboardingDone,
        lastPosition: state.lastPosition,
        intentions: state.intentions,
        today: state.today,
        openedDays: state.openedDays,
        likedVerse: state.likedVerse,
        eveningReminder: state.eveningReminder,
        morningReminder: state.morningReminder,
        morningFired: state.morningFired,
        eveningFired: state.eveningFired,
        preferredTime: state.preferredTime,
        morningTime: state.morningTime,
        eveningTime: state.eveningTime,
        prayerMinutes: state.prayerMinutes,
        mood: state.mood,
        companionDay: state.companionDay,
        companionCount: state.companionCount,
      }),
    },
  ),
)

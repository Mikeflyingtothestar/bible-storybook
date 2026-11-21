import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { VersionCode } from '../bible/catalog'
import type { ThemePreference } from '../theme/tokens'

export type DailyGoal = 5 | 10 | 15

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
  setTheme: (theme: ThemePreference) => void
  setTextScale: (textScale: number) => void
  setVersionCode: (versionCode: VersionCode) => void
  setDailyGoalMin: (dailyGoalMin: DailyGoal) => void
  setOnboardingDone: (onboardingDone: boolean) => void
  setLastPosition: (lastPosition: LastPosition) => void
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
      setTheme: (theme) => set({ theme }),
      setTextScale: (textScale) => set({ textScale: Math.min(2, Math.max(0.75, textScale)) }),
      setVersionCode: (versionCode) => set({ versionCode }),
      setDailyGoalMin: (dailyGoalMin) => set({ dailyGoalMin }),
      setOnboardingDone: (onboardingDone) => set({ onboardingDone }),
      setLastPosition: (lastPosition) => set({ lastPosition }),
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
      }),
    },
  ),
)

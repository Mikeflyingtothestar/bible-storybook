import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useColorScheme } from 'react-native'

import { usePrefs } from '../preferences/store'
import { themes, type ThemeColors, type ThemeName, type ThemePreference } from './tokens'

type ThemeContextValue = {
  preference: ThemePreference
  name: ThemeName
  colors: ThemeColors
  setPreference: (preference: ThemePreference) => void
  fontsReady: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children, fontsReady }: { children: ReactNode; fontsReady: boolean }) {
  const system = useColorScheme()
  const preference = usePrefs((state) => state.theme)
  const setPreference = usePrefs((state) => state.setTheme)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const requested = new URLSearchParams(window.location.search).get('theme')
    if (requested === 'light' || requested === 'dark' || requested === 'sepia' || requested === 'system') {
      setPreference(requested)
    }
  }, [setPreference])

  const name: ThemeName = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference
  const colors = themes[name]

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.theme = name
    document.body.style.backgroundColor = colors.bg
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', colors.bg)
  }, [name, colors.bg])

  const value = useMemo(
    () => ({ preference, name, colors, setPreference, fontsReady }),
    [preference, name, colors, setPreference, fontsReady],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useAppTheme(): ThemeContextValue {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useAppTheme must be used inside ThemeProvider')
  return value
}

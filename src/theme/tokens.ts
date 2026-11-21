/**
 * Storybook palette.
 * Spec swatches are kept as `brand`. Body text, muted text, and buttons use
 * the nearest shade that clears WCAG 2.2 AA (4.5:1) on both page and card
 * backgrounds. Gold stays a fill; labels on gold use `onGold`.
 */
export const brand = {
  light: {
    bg: '#FFFFFF',
    surface: '#F7F5F0',
    text: '#1E2230',
    muted: '#6B7080',
    accent: '#5B6CFF',
    gold: '#C9A227',
  },
  dark: {
    bg: '#0F1220',
    surface: '#181C2E',
    text: '#ECEAF4',
    muted: '#A3A8BD',
    accent: '#8C9BFF',
    gold: '#E3C766',
  },
  sepia: {
    bg: '#F4ECD8',
    surface: '#EADFC6',
    text: '#3B2F23',
    muted: '#7A6A55',
    accent: '#A0672E',
    gold: '#B8892A',
  },
} as const

export type ThemeName = 'light' | 'dark' | 'sepia'
export type ThemePreference = ThemeName | 'system'

export type ThemeColors = {
  bg: string
  surface: string
  text: string
  muted: string
  accent: string
  onAccent: string
  gold: string
  goldText: string
  onGold: string
  border: string
  danger: string
  highlight: {
    yellow: string
    green: string
    blue: string
    pink: string
  }
}

export const themes: Record<ThemeName, ThemeColors> = {
  light: {
    bg: '#FFFFFF',
    surface: '#F7F5F0',
    text: '#1E2230',
    muted: '#6B7080',
    accent: '#5261E6',
    onAccent: '#FFFFFF',
    gold: '#C9A227',
    goldText: '#6F5915',
    onGold: '#1E2230',
    border: '#E4E0D6',
    danger: '#8C3A32',
    highlight: {
      yellow: '#E8C84A',
      green: '#3E8F55',
      blue: '#3A6FBF',
      pink: '#B45478',
    },
  },
  dark: {
    bg: '#0F1220',
    surface: '#181C2E',
    text: '#ECEAF4',
    muted: '#A3A8BD',
    accent: '#8C9BFF',
    onAccent: '#0F1220',
    gold: '#E3C766',
    goldText: '#E3C766',
    onGold: '#141824',
    border: '#2A3048',
    danger: '#F0B4AE',
    highlight: {
      yellow: '#E3C766',
      green: '#8FD0A4',
      blue: '#9EBEFF',
      pink: '#F0B4CE',
    },
  },
  sepia: {
    bg: '#F4ECD8',
    surface: '#EADFC6',
    text: '#3B2F23',
    muted: '#6E5F4D',
    accent: '#805225',
    onAccent: '#FFFFFF',
    gold: '#B8892A',
    goldText: '#6E5219',
    onGold: '#2C2218',
    border: '#D9CDB4',
    danger: '#7A3B32',
    highlight: {
      yellow: '#8A6A12',
      green: '#2F6B40',
      blue: '#2E5C86',
      pink: '#8A4560',
    },
  },
}

export const bedtime = {
  bg: '#0B0D14',
  text: '#E9C99A',
  muted: '#C4A57A',
  surface: '#161926',
} as const

export const HIGHLIGHT_COLORS = ['yellow', 'green', 'blue', 'pink'] as const
export type HighlightColor = (typeof HIGHLIGHT_COLORS)[number]

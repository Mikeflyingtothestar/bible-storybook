import { createElement } from 'react'
import { Platform, View } from 'react-native'

import { useAppTheme } from '@/src/theme/ThemeProvider'

import { Txt } from './ui'

const ROSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none" aria-hidden="true">
  <circle cx="100" cy="100" r="96" stroke="#4F46E5" stroke-width="1.2"/>
  <circle cx="100" cy="100" r="78" stroke="#C4A15A" stroke-width="1"/>
  <circle cx="100" cy="100" r="48" stroke="#6D5BFF" stroke-width="1"/>
  <circle cx="100" cy="100" r="16" stroke="#4F46E5" stroke-width="1.4"/>
  <circle cx="100" cy="100" r="5" fill="#C4A15A"/>
  <path d="M100 4 V196 M4 100 H196 M32 32 L168 168 M168 32 L32 168" stroke="#4F46E5" stroke-width="0.7"/>
  <g stroke="#6D5BFF" stroke-width="1.1">
    <ellipse cx="100" cy="40" rx="14" ry="26"/>
    <ellipse cx="100" cy="40" rx="14" ry="26" transform="rotate(45 100 100)"/>
    <ellipse cx="100" cy="40" rx="14" ry="26" transform="rotate(90 100 100)"/>
    <ellipse cx="100" cy="40" rx="14" ry="26" transform="rotate(135 100 100)"/>
  </g>
</svg>`

const OLIVE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true">
  <path d="M6 54C22 42 34 28 58 8" stroke="#4F46E5" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="22" cy="40" rx="8" ry="4.2" transform="rotate(-35 22 40)" fill="#6D5BFF"/>
  <ellipse cx="34" cy="28" rx="8" ry="4.2" transform="rotate(-48 34 28)" fill="#C4A15A"/>
  <ellipse cx="44" cy="18" rx="7" ry="3.6" transform="rotate(-40 44 18)" fill="#4F46E5"/>
  <circle cx="56" cy="10" r="2.2" fill="#C4A15A"/>
</svg>`

function SvgMark({ markup, width, height }: { markup: string; width: number; height: number }) {
  if (Platform.OS !== 'web') return null
  return createElement('div', {
    'aria-hidden': true,
    style: { width, height, lineHeight: 0 },
    dangerouslySetInnerHTML: { __html: markup },
  })
}

/** Geometric rose window, drawn in violet and gold, kept faint behind a section. */
export function RoseWindow() {
  if (Platform.OS !== 'web') return null
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: -40, right: -30, opacity: 0.16 }}>
      <SvgMark markup={ROSE} width={360} height={360} />
    </View>
  )
}

export function OliveSprig() {
  const { colors } = useAppTheme()
  if (Platform.OS !== 'web') {
    return (
      <Txt size={18} color={colors.accent}>
        ✦
      </Txt>
    )
  }
  return <SvgMark markup={OLIVE} width={36} height={36} />
}

export function Wordmark() {
  const { colors } = useAppTheme()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Txt size={22} weight={700} serif color={colors.accent}>
        ☧
      </Txt>
      <Txt weight={700}>Bible Storybook</Txt>
    </View>
  )
}

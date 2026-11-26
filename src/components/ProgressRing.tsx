import { createElement } from 'react'
import { Platform, View } from 'react-native'

import { useAppTheme } from '@/src/theme/ThemeProvider'

import { Txt } from './ui'

export function ProgressRing({ done, total }: { done: number; total: number }) {
  const { colors } = useAppTheme()
  const value = total === 0 ? 0 : Math.max(0, Math.min(1, done / total))
  const label = `${done}/${total}`
  if (Platform.OS === 'web') {
    const radius = 26
    const circ = 2 * Math.PI * radius
    return createElement(
      'div',
      { style: { width: 72, height: 72, position: 'relative' }, 'aria-label': `${done} of ${total} done` },
      createElement(
        'svg',
        { width: 72, height: 72, viewBox: '0 0 72 72' },
        createElement('circle', { cx: 36, cy: 36, r: radius, fill: 'none', stroke: colors.border, strokeWidth: 6 }),
        createElement('circle', {
          cx: 36,
          cy: 36,
          r: radius,
          fill: 'none',
          stroke: colors.accent,
          strokeWidth: 6,
          strokeDasharray: `${circ * value} ${circ}`,
          strokeLinecap: 'round',
          transform: 'rotate(-90 36 36)',
        }),
      ),
      createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.text, fontSize: 13, fontWeight: 700 } }, label),
    )
  }
  return (
    <View accessibilityLabel={`${done} of ${total} done`} style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 6, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
      <Txt weight={700}>{label}</Txt>
    </View>
  )
}

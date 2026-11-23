import { Link, usePathname } from 'expo-router'
import { Platform, Pressable, View, type ViewStyle } from 'react-native'

import { useAppTheme } from '@/src/theme/ThemeProvider'

import { Wordmark } from './Motifs'
import { Txt } from './ui'

const LINKS = [
  { href: '/home' as const, label: 'Home' },
  { href: '/bible' as const, label: 'Bible' },
  { href: '/stories' as const, label: 'Stories' },
  { href: '/family' as const, label: 'Family' },
  { href: '/me' as const, label: 'Me' },
]

export function WebNav() {
  const pathname = usePathname()
  const { colors, name } = useAppTheme()
  const glass = name === 'dark' ? 'rgba(12,12,16,0.86)' : name === 'sepia' ? 'rgba(246,240,228,0.9)' : 'rgba(255,255,255,0.86)'
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: glass,
        flexWrap: 'wrap',
        ...(Platform.OS === 'web' ? ({ position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(18px)' } as unknown as ViewStyle) : null),
      }}
    >
      <Link href="/" asChild>
        <Pressable accessibilityRole="link" accessibilityLabel="Bible Storybook home">
          <Wordmark />
        </Pressable>
      </Link>
      <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
        {LINKS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href} asChild>
              <Pressable
                accessibilityRole="link"
                accessibilityState={{ selected: active }}
                style={{ minHeight: 40, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center', backgroundColor: active ? colors.accent : 'transparent' }}
              >
                <Txt weight={600} color={active ? colors.onAccent : colors.text}>
                  {item.label}
                </Txt>
              </Pressable>
            </Link>
          )
        })}
      </View>
    </View>
  )
}

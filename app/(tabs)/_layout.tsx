import Feather from '@expo/vector-icons/Feather'
import { Link, Tabs, usePathname } from 'expo-router'
import { Pressable, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Wordmark } from '@/src/components/Motifs'
import { fontSans, Txt } from '@/src/components/ui'
import { gratitudeStreak } from '@/src/journal/streak'
import { usePrefs } from '@/src/preferences/store'
import { dayKey } from '@/src/teachings/daily'
import { useAppTheme } from '@/src/theme/ThemeProvider'

const NAV = [
  { href: '/home' as const, label: 'Today', icon: 'sun' as const },
  { href: '/bible' as const, label: 'Bible', icon: 'book-open' as const },
  { href: '/companion' as const, label: 'Companion', icon: 'message-circle' as const },
  { href: '/pray' as const, label: 'Pray', icon: 'feather' as const },
  { href: '/journal' as const, label: 'Journal', icon: 'edit-3' as const },
  { href: '/me' as const, label: 'More', icon: 'grid' as const },
]

function Sidebar() {
  const { colors } = useAppTheme()
  const pathname = usePathname()
  const opened = usePrefs((state) => state.openedDays)
  const streak = gratitudeStreak(opened, dayKey(new Date()))
  return (
    <View style={{ width: 232, borderRightWidth: 1, borderRightColor: colors.border, backgroundColor: colors.surface, padding: 18, gap: 18 }}>
      <Wordmark />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Txt weight={700} color={colors.onAccent}>Y</Txt>
        </View>
        <View>
          <Txt weight={700}>You</Txt>
          <Txt size={13} color={colors.muted}>{streak === 0 ? 'No streak to keep' : streak === 1 ? '1 gentle day' : `${streak} gentle days`}</Txt>
        </View>
      </View>
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link key={item.href} href={item.href} asChild>
            <Pressable accessibilityRole="link" accessibilityState={{ selected: active }} style={{ minHeight: 44, borderRadius: 12, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: active ? colors.bg : 'transparent' }}>
              <Feather name={item.icon} size={18} color={active ? colors.accent : colors.muted} />
              <Txt weight={700} color={active ? colors.accent : colors.text}>{item.label}</Txt>
            </Pressable>
          </Link>
        )
      })}
    </View>
  )
}

export default function TabLayout() {
  const { colors } = useAppTheme()
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const wide = width >= 960
  return (
    <View style={{ flex: 1, flexDirection: wide ? 'row' : 'column', backgroundColor: colors.bg }}>
      {wide ? <Sidebar /> : null}
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.muted,
            tabBarStyle: wide
              ? { display: 'none' }
              : {
                  backgroundColor: colors.bg,
                  borderTopColor: colors.border,
                  minHeight: 64 + insets.bottom,
                  paddingTop: 8,
                  paddingBottom: Math.max(insets.bottom, 10),
                },
            tabBarShowLabel: true,
            tabBarLabelStyle: { fontFamily: fontSans(600), fontSize: 11 },
          }}
        >
          <Tabs.Screen name="home" options={{ title: 'Today', tabBarIcon: ({ color }) => <Feather name="sun" color={String(color)} size={22} /> }} />
          <Tabs.Screen name="bible" options={{ title: 'Bible', tabBarIcon: ({ color }) => <Feather name="book-open" color={String(color)} size={22} /> }} />
          <Tabs.Screen name="companion" options={{ title: 'Companion', tabBarIcon: ({ color }) => <Feather name="message-circle" color={String(color)} size={22} /> }} />
          <Tabs.Screen name="pray" options={{ title: 'Pray', tabBarIcon: ({ color }) => <Feather name="feather" color={String(color)} size={22} /> }} />
          <Tabs.Screen name="journal" options={{ title: 'Journal', tabBarIcon: ({ color }) => <Feather name="edit-3" color={String(color)} size={22} /> }} />
          <Tabs.Screen name="stories" options={{ title: 'Stories', tabBarButton: () => null }} />
          <Tabs.Screen name="family" options={{ title: 'Family', tabBarButton: () => null }} />
          <Tabs.Screen name="learn" options={{ title: 'Learn', tabBarButton: () => null }} />
          <Tabs.Screen name="me" options={{ title: 'More', tabBarIcon: ({ color }) => <Feather name="grid" color={String(color)} size={22} /> }} />
        </Tabs>
      </View>
    </View>
  )
}

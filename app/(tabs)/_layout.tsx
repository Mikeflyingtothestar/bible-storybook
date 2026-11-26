import Feather from '@expo/vector-icons/Feather'
import { Link, Tabs, usePathname } from 'expo-router'
import { Pressable, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Wordmark } from '@/src/components/Motifs'
import { Txt } from '@/src/components/ui'
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
          tabBar={(props) => {
            const bar = props as unknown as {
              state: { index: number; routes: { key: string; name: string }[] }
              descriptors: Record<string, { navigation: { navigate: (name: string) => void } }>
            }
            return wide ? <View /> : <PhoneTabs state={bar.state} descriptors={bar.descriptors} bottom={insets.bottom} />
          }}
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.muted,
          }}
        >
          <Tabs.Screen name="home" options={{ title: 'Today' }} />
          <Tabs.Screen name="bible" options={{ title: 'Bible' }} />
          <Tabs.Screen name="companion" options={{ title: 'Ask' }} />
          <Tabs.Screen name="pray" options={{ title: 'Pray' }} />
          <Tabs.Screen name="journal" options={{ title: 'Journal' }} />
          <Tabs.Screen name="stories" options={{ title: 'Stories', tabBarButton: () => null }} />
          <Tabs.Screen name="family" options={{ title: 'Family', tabBarButton: () => null }} />
          <Tabs.Screen name="learn" options={{ title: 'Learn', tabBarButton: () => null }} />
          <Tabs.Screen name="me" options={{ title: 'More' }} />
        </Tabs>
      </View>
    </View>
  )
}

const PHONE_TABS = [
  { name: 'home', label: 'Today', icon: 'sun' as const },
  { name: 'bible', label: 'Bible', icon: 'book-open' as const },
  { name: 'companion', label: 'Ask', icon: 'message-circle' as const },
  { name: 'pray', label: 'Pray', icon: 'feather' as const },
  { name: 'journal', label: 'Journal', icon: 'edit-3' as const },
  { name: 'me', label: 'More', icon: 'grid' as const },
]

function PhoneTabs({
  state,
  descriptors,
  bottom,
}: {
  state: { index: number; routes: { key: string; name: string }[] }
  descriptors: Record<string, { navigation: { navigate: (name: string) => void } }>
  bottom: number
}) {
  const { colors } = useAppTheme()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'stretch', backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 6, paddingBottom: Math.max(bottom, 8) }}>
      {PHONE_TABS.map((item) => {
        const route = state.routes.find((entry) => entry.name === item.name)
        const index = state.routes.findIndex((entry) => entry.name === item.name)
        const active = state.index === index
        return (
          <Pressable
            key={item.name}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
            onPress={() => {
              if (route) descriptors[route.key]?.navigation.navigate(route.name)
            }}
            style={{ flex: 1, minWidth: 0, minHeight: 52, alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: 2 }}
          >
            <Feather name={item.icon} size={20} color={active ? colors.accent : colors.muted} />
            <Txt size={12} weight={600} color={active ? colors.accent : colors.muted} style={{ textAlign: 'center' }}>
              {item.label}
            </Txt>
          </Pressable>
        )
      })}
    </View>
  )
}

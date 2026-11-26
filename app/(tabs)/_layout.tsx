import Feather from '@expo/vector-icons/Feather'
import { Tabs } from 'expo-router'
import { Platform, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { WebNav } from '@/src/components/WebNav'
import { fontSans } from '@/src/components/ui'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function TabLayout() {
  const { colors } = useAppTheme()
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const wide = Platform.OS === 'web' && width >= 960
  return (
    <View style={{ flex: 1 }}>
      {wide ? <WebNav /> : null}
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
                  minHeight: 56 + insets.bottom,
                  paddingTop: 6,
                  paddingBottom: Math.max(insets.bottom, 8),
                },
            tabBarLabelStyle: { fontFamily: fontSans(600), fontSize: 11, letterSpacing: 0.2 },
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

import Feather from '@expo/vector-icons/Feather'
import { Tabs } from 'expo-router'
import { Platform, View } from 'react-native'

import { WebNav } from '@/src/components/WebNav'
import { fontSans } from '@/src/components/ui'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function TabLayout() {
  const { colors } = useAppTheme()
  const web = Platform.OS === 'web'
  return (
    <View style={{ flex: 1 }}>
      {web ? <WebNav /> : null}
      <View style={{ flex: 1 }}>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: web
          ? { display: 'none' }
          : { backgroundColor: colors.bg, borderTopColor: colors.border, minHeight: 64, paddingTop: 6 },
        tabBarLabelStyle: { fontFamily: fontSans(600), fontSize: 11, letterSpacing: 0.2 },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color }) => <Feather name="home" color={String(color)} size={22} /> }} />
      <Tabs.Screen name="bible" options={{ title: 'Bible', tabBarIcon: ({ color }) => <Feather name="book-open" color={String(color)} size={22} /> }} />
      <Tabs.Screen name="stories" options={{ title: 'Stories', tabBarIcon: ({ color }) => <Feather name="image" color={String(color)} size={22} /> }} />
      <Tabs.Screen name="family" options={{ title: 'Family', tabBarIcon: ({ color }) => <Feather name="users" color={String(color)} size={22} /> }} />
      <Tabs.Screen name="me" options={{ title: 'Me', tabBarIcon: ({ color }) => <Feather name="user" color={String(color)} size={22} /> }} />
    </Tabs>
      </View>
    </View>
  )
}

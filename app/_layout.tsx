import '../global.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AuthProvider } from '@/src/auth/AuthProvider'
import { ThemeProvider } from '@/src/theme/ThemeProvider'

void SplashScreen.preventAutoHideAsync().catch(() => undefined)

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000 } },
})

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400: require('../assets/fonts/Inter_400.ttf'),
    Inter_600: require('../assets/fonts/Inter_600.ttf'),
    Inter_700: require('../assets/fonts/Inter_700.ttf'),
    Playfair_500: require('../assets/fonts/Playfair_500.ttf'),
    Playfair_700: require('../assets/fonts/Playfair_700.ttf'),
  })

  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => undefined)
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || navigator.webdriver) return
    void navigator.serviceWorker.register('/bible-storybook/sw.js').catch(() => undefined)
  }, [])

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider fontsReady={Boolean(fontsLoaded)}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(marketing)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(onboarding)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth/callback" />
              <Stack.Screen name="auth/update-password" />
              <Stack.Screen name="bedtime" />
              <Stack.Screen name="paywall" />
            </Stack>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}

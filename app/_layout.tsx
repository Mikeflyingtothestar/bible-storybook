import '../global.css'

import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular'
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold'
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold'
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold'
import { Literata_400Regular } from '@expo-google-fonts/literata/400Regular'
import { Literata_600SemiBold } from '@expo-google-fonts/literata/600SemiBold'
import { Literata_700Bold } from '@expo-google-fonts/literata/700Bold'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AuthProvider } from '@/src/auth/AuthProvider'
import { ThemeProvider } from '@/src/theme/ThemeProvider'

void SplashScreen.preventAutoHideAsync().catch(() => undefined)

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000 } },
})

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Literata_400Regular,
    Literata_600SemiBold,
    Literata_700Bold,
  })
  const [waited, setWaited] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setWaited(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  const ready = fontsLoaded || Boolean(fontError) || waited

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync().catch(() => undefined)
  }, [ready])

  if (!ready) return null

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider fontsReady={fontsLoaded}>
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

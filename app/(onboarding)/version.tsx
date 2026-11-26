import { useRouter } from 'expo-router'
import { Pressable, View } from 'react-native'

import { VERSIONS, type VersionCode } from '@/src/bible/catalog'
import { NATURE } from '@/src/art/images'
import { OnboardingStep } from '@/src/components/OnboardingStep'
import { Photo } from '@/src/components/Photo'
import { Txt } from '@/src/components/ui'
import { usePrefs } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function ChooseVersion() {
  const router = useRouter()
  const version = usePrefs((state) => state.versionCode)
  const setVersion = usePrefs((state) => state.setVersionCode)
  const setDone = usePrefs((state) => state.setOnboardingDone)
  const { colors } = useAppTheme()
  return (
    <OnboardingStep
      step="4 of 4"
      title="Which translation should we open?"
      body="You can change this any time. A few World English Bible chapters are already on this device."
      label="Start today"
      onFinish={() => {
        setDone(true)
        router.replace('/home')
      }}
    >
      <Photo source={NATURE.sunrise} alt="Morning light" height={120} />
      <View style={{ gap: 8 }}>
        {VERSIONS.map((item) => {
          const selected = version === item.code
          return (
            <Pressable
              key={item.code}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setVersion(item.code as VersionCode)}
              style={{
                minHeight: 52,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: selected ? colors.accent : colors.border,
                backgroundColor: selected ? colors.surface : colors.bg,
                justifyContent: 'center',
                paddingHorizontal: 14,
              }}
            >
              <Txt weight={700}>
                {item.code} · {item.name}
              </Txt>
            </Pressable>
          )
        })}
      </View>
    </OnboardingStep>
  )
}

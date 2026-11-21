import { Pressable, View } from 'react-native'

import { VERSIONS, type VersionCode } from '@/src/bible/catalog'
import { OnboardingStep } from '@/src/components/OnboardingStep'
import { Txt } from '@/src/components/ui'
import { usePrefs } from '@/src/preferences/store'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function ChooseVersion() {
  const version = usePrefs((state) => state.versionCode)
  const setVersion = usePrefs((state) => state.setVersionCode)
  const { colors } = useAppTheme()
  return (
    <OnboardingStep
      step="1 of 4"
      title="Which Bible should we open?"
      body="You can change this any time. The World English Bible is the default, and a few of its chapters are already on this device."
      next="/theme"
    >
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

import { useRouter, type Href } from 'expo-router'
import type { ReactNode } from 'react'
import { View } from 'react-native'

import { useAppTheme } from '../theme/ThemeProvider'
import { Button, Column, Screen, Txt } from './ui'

export function OnboardingStep({
  step,
  title,
  body,
  children,
  next,
  onFinish,
  label = 'Continue',
}: {
  step: string
  title: string
  body: string
  children: ReactNode
  next?: Href
  onFinish?: () => void
  label?: string
}) {
  const router = useRouter()
  const { colors } = useAppTheme()
  const match = /^(\d+) of (\d+)/.exec(step)
  const current = match ? Number(match[1]) : 1
  const total = match ? Number(match[2]) : 4
  return (
    <Screen>
      <Column width={560} style={{ paddingTop: 36, gap: 16 }}>
        <View style={{ height: 6, borderRadius: 99, backgroundColor: colors.border, overflow: 'hidden' }}>
          <View style={{ height: 6, width: `${(current / total) * 100}%`, backgroundColor: colors.accent }} />
        </View>
        <Txt weight={700} color={colors.accent}>{step}</Txt>
        <Txt size={34} weight={700} serif>{title}</Txt>
        <Txt color={colors.muted}>{body}</Txt>
        {children}
        <Button
          label={label}
          testID="onboarding-next"
          onPress={() => {
            if (onFinish) onFinish()
            else if (next) router.push(next)
          }}
        />
      </Column>
    </Screen>
  )
}

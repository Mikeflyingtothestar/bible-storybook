import { useRouter, type Href } from 'expo-router'
import type { ReactNode } from 'react'

import { Button, Column, Screen, Txt } from './ui'
import { useAppTheme } from '../theme/ThemeProvider'

export function OnboardingStep({
  step,
  title,
  body,
  children,
  next,
}: {
  step: string
  title: string
  body: string
  children: ReactNode
  next: Href
}) {
  const router = useRouter()
  const { colors } = useAppTheme()
  return (
    <Screen>
      <Column width={560} style={{ paddingTop: 48, gap: 16 }}>
        <Txt weight={700} color={colors.accent}>
          {step}
        </Txt>
        <Txt size={34} weight={700} serif>
          {title}
        </Txt>
        <Txt color={colors.muted}>{body}</Txt>
        {children}
        <Button label="Continue" onPress={() => router.push(next)} testID="onboarding-next" />
      </Column>
    </Screen>
  )
}

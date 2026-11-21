import { Dashboard } from '@/src/components/Dashboard'
import { AppBar, Column, Screen, Txt } from '@/src/components/ui'
import { JOURNEY_LEVELS } from '@/src/progress/journey'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function JourneyScreen() {
  const { colors } = useAppTheme()
  return (
    <Screen>
      <AppBar title="Faith Journey" backHref="/me" />
      <Column width={720} style={{ gap: 12 }}>
        <Txt color={colors.muted}>Levels describe a reading habit. They never go down, and they are not a score you show anyone unless you choose to.</Txt>
        <Dashboard />
        {JOURNEY_LEVELS.map((level) => (
          <Txt key={level.level}>
            {level.level}. {level.name} · {level.minPoints} · {level.meaning}
          </Txt>
        ))}
      </Column>
    </Screen>
  )
}

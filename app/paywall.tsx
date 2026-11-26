import { Link } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import Feather from '@expo/vector-icons/Feather'

import { useAuth } from '@/src/auth/AuthProvider'
import { Button, Card, Column, Screen, Txt } from '@/src/components/ui'
import { joinWaitlist } from '@/src/data/wellness'
import { PLANS } from '@/src/pricing/plans'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export function upgradeMessage(): string {
  return 'Plans launching soon. You’re on the waitlist.'
}

export default function Paywall() {
  const { colors } = useAppTheme()
  const { user } = useAuth()
  const [note, setNote] = useState<string | null>(null)
  return (
    <Screen testID="paywall">
      <Column width={1040} style={{ paddingTop: 28, gap: 18 }}>
        <Link href="/me" asChild>
          <Button label="Back" variant="quiet" />
        </Link>
        <Txt size={40} weight={700} serif>Plans</Txt>
        <Txt color={colors.muted}>Plans launching soon. Join the waitlist. Cancel anytime, no weekly billing.</Txt>
        <Card>
          <Txt size={22} weight={700}>Free</Txt>
          <Txt serif size={28}>$0</Txt>
          <Txt color={colors.muted}>Daily verse, a short teaching, morning and night prayer, and a small journal. This is yours now.</Txt>
        </Card>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {PLANS.map((plan) => (
            <View key={plan.id} style={{ flexGrow: 1, flexBasis: 260, minWidth: 0 }}>
              <Card style={{ borderWidth: plan.best ? 2 : 1, borderColor: plan.best ? colors.accent : colors.border, gap: 10 }}>
                {plan.best ? <Txt weight={700} color={colors.accent}>Best value</Txt> : null}
                <Txt size={22} weight={700}>{plan.name}</Txt>
                <Txt serif size={32}>{plan.price}</Txt>
                <Txt color={colors.muted}>{plan.detail}</Txt>
                {plan.points.map((point) => (
                  <View key={point} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Feather name="check" size={16} color={colors.accent} />
                    <Txt>{point}</Txt>
                  </View>
                ))}
                <Button
                  label="Join the waitlist"
                  testID={plan.id === 'premium-monthly' ? 'upgrade' : undefined}
                  onPress={() => {
                    setNote(upgradeMessage())
                    if (user) void joinWaitlist(user.id, plan.id)
                  }}
                />
              </Card>
            </View>
          ))}
        </View>
        {note ? (
          <View testID="upgrade-note">
            <Txt weight={700}>{note}</Txt>
          </View>
        ) : null}
      </Column>
    </Screen>
  )
}

import { Link } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { Button, Card, Column, Screen, Txt } from '@/src/components/ui'
import { useAuth } from '@/src/auth/AuthProvider'
import { joinWaitlist } from '@/src/data/wellness'
import { useEntitlement } from '@/src/entitlement/useEntitlement'
import { PLANS } from '@/src/pricing/plans'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export function upgradeMessage(): string {
  return 'Coming soon'
}

export default function Paywall() {
  const { colors } = useAppTheme()
  const { user } = useAuth()
  const { tier, billingEnabled } = useEntitlement()
  const [note, setNote] = useState<string | null>(null)
  return (
    <Screen testID="paywall">
      <Column width={760} style={{ paddingTop: 28, gap: 14 }}>
        <Link href="/me">
          <Txt weight={700} color={colors.accent}>
            Back
          </Txt>
        </Link>
        <Txt size={36} weight={700} serif>
          Plans
        </Txt>
        <Txt color={colors.muted}>
          Your plan is {tier}. Billing is {billingEnabled ? 'on' : 'off'}. Monthly or annual only. Cancel anytime, no weekly billing, and no trial that turns into a charge. Nothing here can be purchased.
        </Txt>
        <Txt>
          Individual plans come first. A family price, US$9.99 a month, is only a note for later: each person already has their own profile, and no one is asked to pay for a household yet.
        </Txt>
        {PLANS.map((plan) => (
          <Card key={plan.id}>
            <Txt size={22} weight={800}>
              {plan.name}
            </Txt>
            <Txt color={colors.goldText}>{plan.price}</Txt>
            <Txt color={colors.muted}>{plan.detail}</Txt>
            {plan.comingSoon ? (
              <Button
                label="Coming soon"
                testID={plan.id === 'premium-monthly' ? 'upgrade' : undefined}
                onPress={() => {
                  setNote(upgradeMessage())
                  if (user) void joinWaitlist(user.id, plan.id)
                }}
              />
            ) : null}
          </Card>
        ))}
        {note ? (
          <View testID="upgrade-note">
            <Txt weight={700}>{note}</Txt>
          </View>
        ) : null}
      </Column>
    </Screen>
  )
}

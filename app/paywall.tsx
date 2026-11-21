import { Link } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { Button, Card, Column, Screen, Txt } from '@/src/components/ui'
import { useEntitlement } from '@/src/entitlement/useEntitlement'
import { useAppTheme } from '@/src/theme/ThemeProvider'

const PLANS = [
  { name: 'Free', price: '$0', detail: 'The whole Bible text, bookmarks, device voice, themes, and a short bedtime timer.' },
  { name: 'Plus', price: 'US$4.99/mo planned', detail: 'Illustrated stories, premium voices, offline media, and a larger family.' },
  { name: 'Premium', price: 'US$9.99/mo planned', detail: 'Plus video stories in human or anime style, when that flag is turned on.' },
]

export function upgradeMessage(): string {
  return 'Coming soon'
}

export default function Paywall() {
  const { colors } = useAppTheme()
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
          Your plan is {tier}. Billing is {billingEnabled ? 'on' : 'off'}. Nothing here can be purchased.
        </Txt>
        {PLANS.map((plan) => (
          <Card key={plan.name}>
            <Txt size={22} weight={800}>
              {plan.name}
            </Txt>
            <Txt color={colors.goldText}>{plan.price}</Txt>
            <Txt color={colors.muted}>{plan.detail}</Txt>
          </Card>
        ))}
        <Button label="Coming soon" testID="upgrade" onPress={() => setNote(upgradeMessage())} />
        {note ? (
          <View testID="upgrade-note">
            <Txt weight={700}>{note}</Txt>
          </View>
        ) : null}
      </Column>
    </Screen>
  )
}

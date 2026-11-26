import Feather from '@expo/vector-icons/Feather'
import { Link } from 'expo-router'
import { useState } from 'react'
import { TextInput, View } from 'react-native'

import { Button, Card, Column, Screen, Txt, fontSans } from '@/src/components/ui'
import { joinWaitlist } from '@/src/data/wellness'
import { isWaitlistEmail } from '@/src/pricing/plans'
import { PLANS } from '@/src/pricing/plans'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export function upgradeMessage(): string {
  return 'Plans launching soon. You’re on the waitlist.'
}

export default function Paywall() {
  const { colors } = useAppTheme()
  const [email, setEmail] = useState('')
  const [note, setNote] = useState<string | null>(null)
  const [joined, setJoined] = useState(false)
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
        <TextInput accessibilityLabel="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email for the waitlist" placeholderTextColor={colors.muted} style={{ minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 14, color: colors.text, fontFamily: fontSans(), backgroundColor: colors.surface }} />
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
                  label={joined ? 'You’re on the list' : 'Join the waitlist'}
                  testID={plan.id === 'premium-monthly' ? 'upgrade' : undefined}
                  onPress={() => {
                    if (!isWaitlistEmail(email)) {
                      setNote('Enter a valid email address.')
                      setJoined(false)
                      return
                    }
                    void joinWaitlist(email, plan.id).then((error) => {
                      if (error && error.code !== 'conflict') {
                        setJoined(false)
                        setNote(error.message)
                        return
                      }
                      setJoined(true)
                      setNote(upgradeMessage())
                    })
                  }}
                />
              </Card>
            </View>
          ))}
        </View>
        {note ? (
          <View testID={joined ? 'waitlist-success' : 'upgrade-note'}>
            <Txt weight={700}>{joined ? 'You’re on the list. We’ll write when plans open.' : note}</Txt>
          </View>
        ) : null}
      </Column>
    </Screen>
  )
}

import { useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'

import { answerQuestion, COMPANION_DISCLAIMER, type CompanionResult } from '@/src/companion/answer'
import { callCompanionLlm } from '@/src/companion/llm'
import { AppBar, Card, Column, Screen, Txt, fontSans } from '@/src/components/ui'
import { usePrefs } from '@/src/preferences/store'
import { dayKey } from '@/src/teachings/daily'
import { useAppTheme } from '@/src/theme/ThemeProvider'
import { requireVerse } from '@/src/wellness/bundled'

const BREATH = ['Breathe in for 4', 'Hold for 4', 'Breathe out for 4']

export default function CompanionScreen() {
  const { colors } = useAppTheme()
  const companionDay = usePrefs((state) => state.companionDay)
  const companionCount = usePrefs((state) => state.companionCount)
  const noteAsk = usePrefs((state) => state.noteCompanionAsk)
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<CompanionResult | null>(null)
  const [calm, setCalm] = useState(0)
  const [typing, setTyping] = useState(false)
  const comfort = requireVerse('PSA.23.2')
  const day = dayKey(new Date())
  const used = companionDay === day ? companionCount : 0
  const remaining = Math.max(0, 5 - used)

  async function ask() {
    setTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 350))
    setTyping(false)
    if (remaining <= 0) {
      setResult({ kind: 'need-more', text: 'Five questions are included today. The Calm path below stays open. More questions are marked Premium and are not blocked forever.', disclaimer: COMPANION_DISCLAIMER })
      return
    }
    const next = answerQuestion(question)
    setResult(next)
    if (next.kind === 'answer') {
      noteAsk(day)
      await callCompanionLlm({ question, citations: next.citations })
    }
  }

  return (
    <Screen testID="companion">
      <AppBar title="Companion" />
      <Column width={720} style={{ gap: 14 }}>
        <Txt size={32} weight={700} serif>
          Ask in plain words
        </Txt>
        <Txt color={colors.muted}>{COMPANION_DISCLAIMER} It can be wrong. {remaining} of 5 free questions left today. Today itself is never locked behind this.</Txt>
        <Pressable accessibilityRole="button" accessibilityLabel="Calm and comfort" onPress={() => setCalm((value) => (value + 1) % BREATH.length)} style={{ minHeight: 48, borderRadius: 16, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
          <Txt weight={700}>Calm / Comfort</Txt>
          <Txt>{BREATH[calm]}</Txt>
          <Txt color={colors.muted}>
            {comfort.label}: {comfort.text}
          </Txt>
        </Pressable>
        <TextInput
          accessibilityLabel="Question"
          value={question}
          onChangeText={setQuestion}
          placeholder="For example, worry or rest"
          placeholderTextColor={colors.muted}
          style={{ minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, color: colors.text, fontFamily: fontSans() }}
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Ask" onPress={() => void ask()} style={{ minHeight: 48, borderRadius: 999, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Txt weight={700} color={colors.onAccent}>
            Ask
          </Txt>
        </Pressable>
        <View style={{ alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
          <Txt size={13} weight={700}>{remaining} left today</Txt>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {['I feel anxious', 'Help me rest', 'A verse for grief'].map((prompt) => (
            <Pressable key={prompt} accessibilityRole="button" onPress={() => setQuestion(prompt)} style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 999, justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
              <Txt>{prompt}</Txt>
            </Pressable>
          ))}
        </View>
        {typing ? <Txt color={colors.muted}>…</Txt> : null}
        {result ? (
          <View style={{ alignSelf: result.kind === 'answer' ? 'flex-start' : 'flex-start', maxWidth: 560, gap: 8 }}>
            <View style={{ borderRadius: 20, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
              <Txt>{result.text}</Txt>
            </View>
            {result.kind === 'answer'
              ? result.citations.map((verse) => (
                  <Card key={verse.osisRef}>
                    <Txt weight={700} color={colors.accent}>{verse.label}</Txt>
                    <Txt serif>{verse.text}</Txt>
                  </Card>
                ))
              : null}
            {result.kind === 'answer' && result.crisis ? (
              <Txt weight={700}>If you are in danger, contact local emergency services. Befrienders Malaysia and findahelpline.com can help.</Txt>
            ) : null}
            <Txt size={13} color={colors.muted}>{result.disclaimer}</Txt>
          </View>
        ) : null}
      </Column>
    </Screen>
  )
}

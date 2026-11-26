import { createElement, useState } from 'react'
import { Linking, Platform, Pressable, ScrollView, TextInput, View, type ViewStyle } from 'react-native'

import { useAuth } from '@/src/auth/AuthProvider'
import { answerQuestion, COMPANION_DISCLAIMER, CRISIS_RESOURCES, type CompanionResult } from '@/src/companion/answer'
import type { CitedVerse } from '@/src/wellness/bundled'
import { guideFor, TOPIC_GUIDES } from '@/src/companion/library'
import { callCompanionLlm } from '@/src/companion/llm'
import { NATURE } from '@/src/art/images'
import { AppBar, Card, Screen, Txt, fontSans } from '@/src/components/ui'
import { Photo } from '@/src/components/Photo'
import { consumeCompanionQuestion } from '@/src/data/wellness'
import { usePrefs } from '@/src/preferences/store'
import { dayKey } from '@/src/teachings/daily'
import { useAppTheme } from '@/src/theme/ThemeProvider'
import { requireVerse } from '@/src/wellness/bundled'
import type { TopicId } from '@/src/wellness/topics'

const PROMPTS = ['I feel anxious', 'Help me rest', 'A verse for grief']
const BREATH = ['Breathe in', 'Hold', 'Breathe out']

export default function CompanionScreen() {
  const { colors } = useAppTheme()
  const companionDay = usePrefs((state) => state.companionDay)
  const companionCount = usePrefs((state) => state.companionCount)
  const noteAsk = usePrefs((state) => state.noteCompanionAsk)
  const { user } = useAuth()
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<CompanionResult | null>(null)
  const [asked, setAsked] = useState('')
  const [typing, setTyping] = useState(false)
  const [calmOpen, setCalmOpen] = useState(false)
  const [breath, setBreath] = useState(0)
  const comfort = requireVerse('PSA.23.2')
  const day = dayKey(new Date())
  const used = companionDay === day ? companionCount : 0
  const remaining = Math.max(0, 5 - used)

  function openTopic(id: TopicId) {
    const guide = guideFor(id)
    setAsked(guide.title)
    setQuestion('')
    setResult({
      kind: 'answer',
      reflection: guide.reflection,
      prayer: guide.prayer,
      citations: guide.refs.map((ref) => requireVerse(ref)),
      disclaimer: COMPANION_DISCLAIMER,
    })
  }

  async function ask(text?: string) {
    const query = (text ?? question).trim()
    if (!query) return
    setQuestion('')
    setAsked(query)
    const next = answerQuestion(query)
    if (next.kind === 'crisis') {
      setTyping(false)
      setResult(next)
      return
    }
    setTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 400))
    setTyping(false)
    if (user) {
      const quota = await consumeCompanionQuestion()
      if (quota.source === 'account' && quota.remaining <= 0) {
        setResult({ kind: 'need-more', text: 'Five questions are included today. Calm stays open.', disclaimer: COMPANION_DISCLAIMER })
        return
      }
    } else if (remaining <= 0) {
      setResult({ kind: 'need-more', text: 'Five questions are included today. Calm stays open.', disclaimer: COMPANION_DISCLAIMER })
      return
    }
    setResult(next)
    if (next.kind === 'answer') {
      noteAsk(day)
      await callCompanionLlm({ question: query, citations: next.citations })
    }
  }

  return (
    <Screen testID="companion" scroll={false}>
      <View style={{ flex: 1 }}>
        <AppBar title="Ask" />
        <View style={{ paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <View style={{ borderRadius: 999, paddingHorizontal: 12, minHeight: 32, justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
            <Txt size={13} weight={700}>{remaining} left today</Txt>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
          {!result && !typing ? (
            <View style={{ gap: 12 }}>
              <Photo source={NATURE.leaves} alt="Soft leaves" height={140} />
              <Txt size={28} weight={700} serif>What is on your mind?</Txt>
              <Txt color={colors.muted}>Ask in ordinary words, or open a topic. You will get verses with their references, a short reflection, and a prayer. This is not a therapist.</Txt>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {TOPIC_GUIDES.map((guide) => (
                  <Pressable key={guide.id} accessibilityRole="button" accessibilityLabel={guide.title} onPress={() => openTopic(guide.id)} style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 999, justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
                    <Txt size={14} weight={700}>{guide.title}</Txt>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
          {asked ? (
            <View style={{ alignSelf: 'flex-end', maxWidth: '85%', borderRadius: 18, padding: 12, backgroundColor: colors.accent }}>
              <Txt color={colors.onAccent}>{asked}</Txt>
            </View>
          ) : null}
          {typing ? (
            <View style={{ alignSelf: 'flex-start', borderRadius: 18, padding: 12, backgroundColor: colors.surface }}>
              <Txt color={colors.muted}>Looking up a verse…</Txt>
            </View>
          ) : null}
          {result?.kind === 'crisis' ? <CrisisCard verse={result.verse} /> : null}
          {result?.kind === 'need-more' ? (
            <View style={{ borderRadius: 18, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
              <Txt>{result.text}</Txt>
            </View>
          ) : null}
          {result?.kind === 'answer' ? (
            <View style={{ gap: 8 }} testID="answer-card">
              {result.citations.map((verse) => (
                <Card key={verse.osisRef}>
                  <Txt weight={700} color={colors.accent}>{verse.label}</Txt>
                  <Txt serif>{verse.text}</Txt>
                </Card>
              ))}
              <Card>
                <Txt weight={700}>Reflection</Txt>
                <Txt>{result.reflection}</Txt>
              </Card>
              {result.prayer ? (
                <Card>
                  <Txt weight={700}>Prayer</Txt>
                  <Txt>{result.prayer}</Txt>
                </Card>
              ) : null}
              <Txt size={12} color={colors.muted}>{result.disclaimer}</Txt>
            </View>
          ) : null}
          <Pressable accessibilityRole="button" accessibilityLabel="Open calm breathing" onPress={() => { setCalmOpen(true); setBreath((value) => (value + 1) % 3) }} style={{ minHeight: 88, borderRadius: 20, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, ...(Platform.OS === 'web' && calmOpen ? ({ animation: 'breathe 8s ease-in-out infinite' } as ViewStyle) : null) }} />
            <View style={{ flex: 1 }}>
              <Txt weight={700}>Calm</Txt>
              <Txt color={colors.muted}>{calmOpen ? `${BREATH[breath]} · 4 counts` : 'A slow breath and a verse'}</Txt>
              {calmOpen ? <Txt size={13}>{comfort.label}</Txt> : null}
            </View>
          </Pressable>
        </ScrollView>
        <View style={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {PROMPTS.map((prompt) => (
              <Pressable key={prompt} accessibilityRole="button" onPress={() => void ask(prompt)} style={{ minHeight: 44, paddingHorizontal: 12, borderRadius: 999, justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
                <Txt size={14}>{prompt}</Txt>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingLeft: 16, paddingRight: 6, backgroundColor: colors.surface }}>
            <TextInput accessibilityLabel="Question" value={question} onChangeText={setQuestion} placeholder="Ask a question" placeholderTextColor={colors.muted} style={{ flex: 1, minHeight: 48, color: colors.text, fontFamily: fontSans() }} />
            <Pressable accessibilityRole="button" accessibilityLabel="Send" onPress={() => void ask()} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Txt weight={700} color={colors.onAccent}>↑</Txt>
            </Pressable>
          </View>
          <Txt size={12} color={colors.muted} style={{ textAlign: 'center' }}>
            Answers quote the Bible. Not a therapist, a pastor, or medical advice.{user ? '' : ' Counted on this device until you sign in.'}
          </Txt>
        </View>
      </View>
    </Screen>
  )
}

function CrisisCard({ verse }: { verse: CitedVerse }) {
  return (
    <View testID="crisis-card" style={{ borderRadius: 20, padding: 16, gap: 10, backgroundColor: '#1C1412', borderWidth: 2, borderColor: '#F3E0B8' }}>
      <Txt size={22} weight={700} color="#FFF7F0">You don’t have to go through this alone</Txt>
      <Txt color="#FFF7F0">Call your local emergency number.</Txt>
      <Txt size={13} weight={700} color="#F3E0B8">This is not a therapist.</Txt>
      <CrisisLink href={CRISIS_RESOURCES.findAHelpline} label="Find a helpline" />
      <CrisisLink href={CRISIS_RESOURCES.befriendersWorldwide} label="Befrienders Worldwide" />
      <View style={{ borderRadius: 16, padding: 12, gap: 6, backgroundColor: '#FFF7F0' }}>
        <Txt weight={700} color="#1C1412">{verse.label}</Txt>
        <Txt serif color="#1C1412">{verse.text}</Txt>
      </View>
      <Txt weight={700} color="#FFF7F0">Talk to someone you trust.</Txt>
    </View>
  )
}

function CrisisLink({ href, label }: { href: string; label: string }) {
  const style = { display: 'flex', minHeight: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF7F0', color: '#1C1412', fontWeight: 700, textDecoration: 'none', padding: '0 16px' }
  if (Platform.OS === 'web') {
    return createElement('a', { href, target: '_blank', rel: 'noreferrer', style }, label)
  }
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={label} onPress={() => void Linking.openURL(href)} style={{ minHeight: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF7F0', paddingHorizontal: 16 }}>
      <Txt weight={700} color="#1C1412">{label}</Txt>
    </Pressable>
  )
}

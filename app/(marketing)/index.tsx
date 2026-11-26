import Feather from '@expo/vector-icons/Feather'
import { Link } from 'expo-router'
import { useState, type ReactNode } from 'react'
import { Platform, Pressable, useWindowDimensions, View, type ViewStyle } from 'react-native'

import { NATURE } from '@/src/art/images'
import { Wordmark } from '@/src/components/Motifs'
import { Photo } from '@/src/components/Photo'
import { Button, Screen, ThemeSwitcher, Txt } from '@/src/components/ui'
import { useAppTheme } from '@/src/theme/ThemeProvider'

const lift = Platform.OS === 'web' ? ({ dataSet: { lift: '1' } } as object) : {}

function startsVisible() {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function Reveal({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const [shown, setShown] = useState(startsVisible)
  const hidden: ViewStyle = shown ? { opacity: 1, transform: [{ translateY: 0 }] } : { opacity: 0, transform: [{ translateY: 18 }] }
  const motion: ViewStyle | undefined = Platform.OS === 'web' ? ({ transition: 'opacity 0.7s ease, transform 0.7s ease' } as ViewStyle) : undefined
  return (
    <View
      ref={(node: unknown) => {
        if (!node || shown || Platform.OS !== 'web') return
        const element = node as Element & { reveal?: IntersectionObserver }
        if (element.reveal) return
        const observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) setShown(true)
        }, { threshold: 0.12 })
        element.reveal = observer
        observer.observe(element)
      }}
      style={[hidden, motion, style]}
    >
      {children}
    </View>
  )
}

function Band({ children, background, pad = 80 }: { children: ReactNode; background: string; pad?: number }) {
  return (
    <View style={{ width: '100%', backgroundColor: background, paddingVertical: pad, paddingHorizontal: 20 }}>
      <View style={{ width: '100%', maxWidth: 1120, alignSelf: 'center' }}>{children}</View>
    </View>
  )
}

const FEATURES: { icon: keyof typeof Feather.glyphMap; title: string; body: string; image: 'sunrise' | 'water' | 'leaves' }[] = [
  { icon: 'sun', title: 'Today', body: 'A short daily verse, teaching and prayer. A few minutes, then you are done.', image: 'sunrise' },
  { icon: 'book-open', title: 'Bible', body: 'Public-domain text you can read at your own pace, with a calm type size.', image: 'leaves' },
  { icon: 'message-circle', title: 'Companion', body: 'Plain answers that cite chapter and verse, and say when they might be wrong.', image: 'water' },
  { icon: 'feather', title: 'Prayer', body: 'Morning and night, at times you choose, in 2, 5 or 10 minutes.', image: 'sunrise' },
  { icon: 'moon', title: 'Sleep', body: 'One free wind-down, a narrated scripture story, and a timer that fades.', image: 'water' },
  { icon: 'edit-3', title: 'Journal', body: 'Gratitude prompts and an optional nightly reflection. Private to you.', image: 'leaves' },
  { icon: 'layers', title: 'Learn', body: 'Short tracks for anxiety, sleep and a prayer habit, with light quizzes.', image: 'leaves' },
  { icon: 'heart', title: 'Support', body: 'A mood check-in, verses for hard days, and crisis resources when needed.', image: 'sunrise' },
]

const STEPS = [
  { n: '1', title: 'Say what you need', body: 'Sleep, a quieter mind, or a morning that does not start loud. Today follows that choice.' },
  { n: '2', title: 'Take a few minutes', body: 'A verse, a short prayer, or a wind-down that fades. Scripture is the ground, not a lecture.' },
  { n: '3', title: 'Stop when you are done', body: 'The journal is private. A missed day rests the streak. Nothing here keeps score against you.' },
]

const FAQ = [
  { q: 'What is free?', a: 'The daily verse, a short teaching, morning and night prayer, one sleep story, a small journal, and five companion questions a day. Paid plans are not on sale.' },
  { q: 'Is this a church or a denomination?', a: 'No. It is not a church, a denomination, or a substitute for a congregation. It does not speak for one tradition.' },
  { q: 'What do you keep about me?', a: 'A journal is saved to your account only after you sign in and press save. Mood stays on this device. A waitlist email is stored with the plan name and cannot be read back in the app. A signed-in companion stores a daily count, not the question. Details are on the privacy page.' },
  { q: 'Is the companion a pastor or a therapist?', a: 'No. It quotes the bundled text and can be wrong. It is not a pastor, a therapist, or medical care. If you sound in distress, it points you to crisis lines.' },
  { q: 'Does it work offline?', a: 'A few chapters travel with the app: Genesis 1, Psalms 23 and 121, Matthew 6, John 1 and John 3, plus the sleep stories that use them. The rest of the library needs a connection. There is no offline download yet.' },
  { q: 'How do I cancel?', a: 'Nothing is billed, so there is nothing to cancel. Joining the waitlist does not start a subscription. When a paid plan exists it will be monthly or annual, cancel anytime, with no weekly charge and no trial that becomes a bill.' },
  { q: 'Which text is the reading?', a: 'The bundled reading is the World English Bible, which is public domain. BSB and KJV appear when that library is seeded.' },
  { q: 'What if I miss a day?', a: 'The streak rests. A quiet day does not undo you, and the screen does not scold you for it.' },
]

export default function LandingPage() {
  const { colors, name } = useAppTheme()
  const { width } = useWindowDimensions()
  const heroSize = width > 0 && width < 400 ? 32 : 46
  const heroLine = width > 0 && width < 400 ? 36 : 54
  const wash = name === 'dark' ? '#1A2420' : '#F3EFE6'
  const glass = name === 'dark' ? 'rgba(18,22,20,0.86)' : 'rgba(247,244,238,0.88)'
  return (
    <Screen testID="landing">
      <View style={{ width: '100%', zIndex: 30, backgroundColor: glass, borderBottomWidth: 1, borderBottomColor: colors.border, ...(Platform.OS === 'web' ? ({ position: 'sticky', top: 0, backdropFilter: 'blur(16px)' } as unknown as ViewStyle) : null) }}>
        <View style={{ maxWidth: 1120, width: '100%', alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, gap: 12 }}>
          <Wordmark />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <Link href="/bible" asChild>
              <Pressable accessibilityRole="link" accessibilityLabel="Read" style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 }}>
                <Txt weight={600}>Read</Txt>
              </Pressable>
            </Link>
            <Link href="/sign-in" asChild>
              <Pressable accessibilityRole="link" accessibilityLabel="Sign in" style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 }}>
                <Txt weight={600}>Sign in</Txt>
              </Pressable>
            </Link>
            <Link href="/sign-up" asChild>
              <Button label="Create account" testID="sign-up-link" />
            </Link>
          </View>
        </View>
      </View>

      <Band background={colors.bg} pad={28}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 28, alignItems: 'center', paddingTop: 20 }}>
          <View style={{ flexGrow: 1, flexBasis: 320, minWidth: 0, maxWidth: 560, gap: 18 }}>
            <Txt size={14} weight={700} color={colors.accent} style={{ letterSpacing: 1.4 }}>A FEW QUIET MINUTES</Txt>
            <Txt size={heroSize} weight={700} serif style={{ letterSpacing: -0.6, lineHeight: heroLine, ...(Platform.OS === 'web' ? ({ textWrap: 'balance' } as object) : null) }}>Calm, sleep, and a moment to reflect</Txt>
            <Txt size={18} color={colors.muted} style={{ lineHeight: 28 }}>Scripture is the ground under it. A short verse when you want one, a prayer you can finish, and a wind-down when the day is done.</Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              <Link href="/sign-up" asChild><Button label="Begin for free" /></Link>
              <Link href="/bible" asChild><Button label="Open the reader" variant="quiet" testID="open-reader" /></Link>
            </View>
          </View>
          <View style={{ flexGrow: 1, flexBasis: 300, minWidth: 0, position: 'relative' }}>
            <Photo source={NATURE.sunrise} alt="Soft sunrise over a quiet horizon" height={420} radius={32} eager />
            <View style={{ position: 'absolute', right: 18, bottom: 18, width: 168, borderRadius: 28, padding: 10, backgroundColor: '#111', ...(Platform.OS === 'web' ? ({ boxShadow: '0 18px 40px rgba(28,25,23,0.25)' } as ViewStyle) : null) }}>
              <View style={{ borderRadius: 20, overflow: 'hidden', backgroundColor: '#F7F4EE', padding: 12, gap: 6 }}>
                <Txt size={11} weight={700} color="#0E6B56">TODAY</Txt>
                <Txt size={13} weight={700} serif color="#1C1917">The LORD is my shepherd.</Txt>
                <Txt size={11} color="#5C564E">Psalm 23:1</Txt>
              </View>
            </View>
          </View>
        </View>
      </Band>

      <Band background={wash} pad={64}>
        <Txt size={40} weight={700} serif>How it works</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
          {STEPS.map((step) => (
            <View key={step.n} style={{ flexGrow: 1, flexBasis: 240, minWidth: 0, gap: 8, padding: 20, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
              <Txt size={14} weight={700} color={colors.accent}>{step.n}</Txt>
              <Txt size={22} weight={700} serif>{step.title}</Txt>
              <Txt color={colors.muted}>{step.body}</Txt>
            </View>
          ))}
        </View>
      </Band>

      <Band background={colors.bg}>
        <Reveal>
          <Txt size={40} weight={700} serif>Eight quiet places</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
            {FEATURES.map((feature) => (
              <View key={feature.title} {...lift} style={{ flexGrow: 1, flexBasis: 240, minWidth: 0, backgroundColor: colors.surface, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
                <Photo source={NATURE[feature.image]} alt={`${feature.title} illustration`} height={132} radius={0} />
                <View style={{ padding: 18, gap: 8 }}>
                  <Feather name={feature.icon} size={20} color={colors.accent} />
                  <Txt size={22} weight={700} serif>{feature.title}</Txt>
                  <Txt color={colors.muted}>{feature.body}</Txt>
                </View>
              </View>
            ))}
          </View>
        </Reveal>
      </Band>

      <Band background={wash}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <View style={{ flexGrow: 1, flexBasis: 280, minWidth: 0 }}>
            <Photo source={NATURE.water} alt="Still water at dawn" height={280} />
          </View>
          <View style={{ flexGrow: 1, flexBasis: 320, minWidth: 0, gap: 10 }}>
            <Txt size={40} weight={700} serif>Verses for anxiety</Txt>
            <Txt color={colors.muted} style={{ lineHeight: 26 }}>When worry is loud, the Bible here stays short. Matthew 6 says not to be anxious for tomorrow. Psalm 23 walks a dark valley and does not walk it alone.</Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              <Link href="/bible/MAT/6" asChild><Button label="Read Matthew 6" /></Link>
              <Link href="/bible/PSA/23" asChild><Button label="Read Psalm 23" variant="quiet" /></Link>
            </View>
          </View>
        </View>
      </Band>

      <Band background={colors.bg}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexGrow: 1, flexBasis: 280, minWidth: 0, gap: 8, maxWidth: 560 }}>
            <Txt size={40} weight={700} serif>Free for now</Txt>
            <Txt color={colors.muted} style={{ lineHeight: 26 }}>The daily practice is free. Monthly, annual, and family plans are a waitlist, not a checkout. No weekly billing, and no trial that turns into a charge.</Txt>
          </View>
          <Link href="/pricing" asChild><Button label="See plans" /></Link>
        </View>
      </Band>

      <Band background={wash}>
        <Txt size={40} weight={700} serif>Questions</Txt>
        <View style={{ gap: 12, marginTop: 16 }}>
          {FAQ.map((item) => <Faq key={item.q} q={item.q} a={item.a} />)}
        </View>
      </Band>

      <Band background={colors.bg} pad={40}>
        <ThemeSwitcher />
        <View style={{ marginTop: 28, paddingTop: 20, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <View style={{ gap: 6, maxWidth: 360 }}>
            <Wordmark />
            <Txt color={colors.muted}>A few quiet minutes. Scripture underneath. No leaderboards, no invented praise.</Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              <View accessibilityLabel="App Store, coming soon" style={{ minHeight: 44, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, justifyContent: 'center' }}>
                <Txt size={13} weight={700}>App Store · coming soon</Txt>
              </View>
              <View accessibilityLabel="Google Play, coming soon" style={{ minHeight: 44, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, justifyContent: 'center' }}>
                <Txt size={13} weight={700}>Google Play · coming soon</Txt>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            <Link href="/privacy" asChild><Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}><Txt weight={600} color={colors.accent}>Privacy</Txt></Pressable></Link>
            <Link href="/terms" asChild><Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}><Txt weight={600} color={colors.accent}>Terms</Txt></Pressable></Link>
            <Link href="/contact" asChild><Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}><Txt weight={600} color={colors.accent}>Contact</Txt></Pressable></Link>
          </View>
        </View>
      </Band>
    </Screen>
  )
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  const { colors } = useAppTheme()
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen((value) => !value)} style={{ minHeight: 56, borderRadius: 18, padding: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: 8 }}>
      <Txt weight={700}>{q}</Txt>
      {open ? <Txt color={colors.muted}>{a}</Txt> : null}
    </Pressable>
  )
}

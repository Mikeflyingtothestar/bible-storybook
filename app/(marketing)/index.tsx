import Feather from '@expo/vector-icons/Feather'
import { Link } from 'expo-router'
import { useState, type ReactNode } from 'react'
import { Platform, Pressable, View, type ViewStyle } from 'react-native'

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

const FAQ = [
  { q: 'Which Bible is this?', a: 'The bundled reading is the World English Bible, which is public domain. BSB and KJV are available when the library is seeded.' },
  { q: 'Is there a weekly plan?', a: 'No. Pricing is monthly or annual only. Cancel anytime, no weekly billing, and no trial that turns into a charge.' },
  { q: 'Is the companion a counsellor?', a: 'No. It repeats verses from the bundled text and can be wrong. It is not pastoral or medical advice.' },
  { q: 'What if I miss a day?', a: 'The streak rests. A quiet day does not undo you, and nothing on the screen scolds you for it.' },
]

export default function LandingPage() {
  const { colors, name } = useAppTheme()
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
            <Txt size={14} weight={700} color={colors.accent} style={{ letterSpacing: 1.4 }}>DAILY VERSE</Txt>
            <Txt size={46} weight={700} serif style={{ letterSpacing: -0.8, ...(Platform.OS === 'web' ? ({ textWrap: 'balance' } as object) : null) }}>The Bible, told like a story</Txt>
            <Txt size={18} color={colors.muted} style={{ lineHeight: 28 }}>A few quiet minutes for faith, calm and reflection. Read a daily verse, listen when you want, and rest when the day is done.</Txt>
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

      <Band background={wash} pad={28}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18, justifyContent: 'space-between' }}>
          {['Public-domain Bible text', 'No weekly billing', 'Not medical advice', 'A few quiet minutes'].map((item) => (
            <Txt key={item} weight={700}>{item}</Txt>
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
        <Txt size={40} weight={700} serif>Plans</Txt>
        <Txt color={colors.muted} style={{ marginTop: 8, marginBottom: 20 }}>Monthly or annual. Cancel anytime, no weekly billing.</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {[
            ['Free', '$0', 'Daily verse, a short teaching, a prayer, and a small journal.'],
            ['Monthly', 'US$5.99', 'The fuller library, sleep catalog, and more companion questions. Coming soon.'],
            ['Annual', 'US$39.99', 'A year of the same calm, for less than paying each month.'],
          ].map(([name, price, body]) => (
            <View key={name} {...lift} style={{ flexGrow: 1, flexBasis: 240, minWidth: 0, borderRadius: 24, padding: 24, gap: 8, backgroundColor: colors.surface, borderWidth: name === 'Annual' ? 2 : 1, borderColor: name === 'Annual' ? colors.accent : colors.border }}>
              <Txt weight={700} color={colors.accent}>{name}</Txt>
              <Txt size={32} weight={700} serif>{price}</Txt>
              <Txt color={colors.muted}>{body}</Txt>
            </View>
          ))}
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
            <Txt color={colors.muted}>Public-domain Bible text. A few quiet minutes. No leaderboards.</Txt>
          </View>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Link href="/privacy" asChild><Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}><Txt weight={600} color={colors.accent}>Privacy</Txt></Pressable></Link>
            <Link href="/terms" asChild><Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}><Txt weight={600} color={colors.accent}>Terms</Txt></Pressable></Link>
            <Link href="/pricing" asChild><Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}><Txt weight={600} color={colors.accent}>Pricing</Txt></Pressable></Link>
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

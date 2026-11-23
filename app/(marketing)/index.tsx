import { Link } from 'expo-router'
import { useState, type ReactNode } from 'react'
import { Platform, Pressable, View, type ViewStyle } from 'react-native'

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
        }, { threshold: 0.16 })
        element.reveal = observer
        observer.observe(element)
      }}
      style={[hidden, motion, style]}
    >
      {children}
    </View>
  )
}

function Band({
  children,
  background,
  pad = 88,
}: {
  children: ReactNode
  background: string
  pad?: number
}) {
  return (
    <View style={{ width: '100%', backgroundColor: background, paddingVertical: pad, paddingHorizontal: 20 }}>
      <View style={{ width: '100%', maxWidth: 1120, alignSelf: 'center' }}>{children}</View>
    </View>
  )
}

function ReaderMock({ dark }: { dark?: boolean }) {
  const paper = dark ? '#16141C' : '#FFFEFB'
  const ink = dark ? '#F4E7C8' : '#12121A'
  const mute = dark ? '#C4A57A' : '#5A5870'
  return (
    <View {...lift} style={{ width: 280, borderRadius: 36, padding: 12, backgroundColor: '#12121A', alignSelf: 'center' }}>
      <View style={{ borderRadius: 28, backgroundColor: paper, padding: 22, gap: 14, minHeight: 420 }}>
        <Txt size={12} weight={700} color={mute} style={{ letterSpacing: 1.2 }}>
          GENESIS 1
        </Txt>
        <Txt size={28} weight={700} serif color={ink}>
          Let there be light.
        </Txt>
        {[
          'In the beginning, God created the heavens and the earth.',
          'The earth was formless and empty. Darkness was on the surface of the deep.',
          'God said, “Let there be light,” and there was light.',
        ].map((line, index) => (
          <Txt key={line} serif color={ink} style={{ lineHeight: 26 }}>
            <Txt serif weight={700} color="#4F46E5">
              {index + 1}{' '}
            </Txt>
            {line}
          </Txt>
        ))}
      </View>
    </View>
  )
}

function BookScene() {
  return (
    <View style={{ height: 520, borderRadius: 36, overflow: 'hidden', backgroundColor: '#16132A' }}>
      <View style={{ position: 'absolute', width: 420, height: 420, borderRadius: 210, backgroundColor: '#6D5BFF', top: -80, right: -40, opacity: 0.9 }} />
      <View style={{ position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: '#A79BFF', top: 40, right: 120, opacity: 0.7 }} />
      <View style={{ position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: '#F3E2B3', top: 150, left: 70, opacity: 0.85 }} />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, backgroundColor: '#0E0C18' }} />
      <View style={{ position: 'absolute', left: 48, right: 48, bottom: 78, height: 150, flexDirection: 'row', gap: 6 }}>
        <View style={{ flex: 1, backgroundColor: '#F7F1E4', borderTopLeftRadius: 8, borderBottomLeftRadius: 10, padding: 16, gap: 8 }}>
          <View style={{ height: 8, width: '70%', backgroundColor: '#D9D0EA', borderRadius: 4 }} />
          <View style={{ height: 8, width: '88%', backgroundColor: '#E7E1F4', borderRadius: 4 }} />
          <View style={{ height: 8, width: '60%', backgroundColor: '#E7E1F4', borderRadius: 4 }} />
        </View>
        <View style={{ flex: 1, backgroundColor: '#FFFDF8', borderTopRightRadius: 8, borderBottomRightRadius: 10, padding: 16, gap: 8 }}>
          <View style={{ height: 8, width: '76%', backgroundColor: '#E4DDF3', borderRadius: 4 }} />
          <View style={{ height: 8, width: '90%', backgroundColor: '#EFEAF8', borderRadius: 4 }} />
          <View style={{ height: 8, width: '54%', backgroundColor: '#EFEAF8', borderRadius: 4 }} />
        </View>
      </View>
    </View>
  )
}

export default function LandingPage() {
  const { colors, name } = useAppTheme()
  const wash = name === 'dark' ? '#171522' : name === 'sepia' ? '#EFE6D4' : '#F4F1FF'
  const glass = name === 'dark' ? 'rgba(12,12,16,0.8)' : name === 'sepia' ? 'rgba(246,240,228,0.88)' : 'rgba(255,255,255,0.82)'
  return (
    <Screen testID="landing">
      <View
        style={{
          width: '100%',
          zIndex: 30,
          ...(Platform.OS === 'web' ? ({ position: 'sticky', top: 0, backdropFilter: 'blur(18px)' } as unknown as ViewStyle) : null),
          backgroundColor: glass,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View style={{ maxWidth: 1120, width: '100%', alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, gap: 12 }}>
          <Txt weight={700}>Bible Storybook</Txt>
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

      <Band background={colors.bg} pad={36}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 36, alignItems: 'center', paddingTop: 28, paddingBottom: 20 }}>
          <View style={{ flexGrow: 1, flexBasis: 320, minWidth: 0, maxWidth: 640, gap: 22 }}>
            <Txt size={14} weight={700} color={colors.accent} style={{ letterSpacing: 1.6 }}>
              A FAMILY BIBLE
            </Txt>
            <Txt size={68} weight={700} serif style={{ letterSpacing: -1.5, maxWidth: 640 }}>
              The Bible, told like a story
            </Txt>
            <Txt size={20} color={colors.muted} style={{ maxWidth: 520, lineHeight: 30 }}>
              Read the text, hear each verse as it is highlighted, and keep a quiet record of the days you showed up.
            </Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/bible" asChild>
                <Button label="Open the reader" testID="open-reader" />
              </Link>
              <Link href="/bible/GEN/1" asChild>
                <Button label="Read Genesis 1" variant="quiet" />
              </Link>
            </View>
          </View>
          <View style={{ flexGrow: 1, flexBasis: 320, minWidth: 0, width: '100%' }}>
            <BookScene />
          </View>
        </View>
      </Band>

      <Band background={wash}>
        <Reveal>
          <Txt size={44} weight={700} serif>
            How it works
          </Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 28 }}>
            {[
              ['01', 'Open a chapter', 'Pick a book. The text is on the page before the network finishes.'],
              ['02', 'Listen along', 'The device voice reads a verse and the line lights up with it.'],
              ['03', 'Keep the day', 'A finished chapter marks today. Streaks are gentle, with grace days.'],
            ].map(([step, title, body]) => (
              <View key={step} {...lift} style={{ flexGrow: 1, flexBasis: 240, backgroundColor: colors.bg, borderRadius: 28, padding: 28, gap: 10, borderWidth: 1, borderColor: colors.border }}>
                <Txt size={13} weight={700} color={colors.accent} style={{ letterSpacing: 1.2 }}>
                  {step}
                </Txt>
                <Txt size={26} weight={700} serif>
                  {title}
                </Txt>
                <Txt color={colors.muted}>{body}</Txt>
              </View>
            ))}
          </View>
        </Reveal>
      </Band>

      <Band background={colors.bg}>
        <Reveal>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
            <View style={{ flexGrow: 1, flexBasis: 320, minWidth: 0, gap: 14 }}>
              <Txt size={14} weight={700} color={colors.accent} style={{ letterSpacing: 1.4 }}>
                THE READER
              </Txt>
              <Txt size={48} weight={700} serif>
                A page that stays out of the way
              </Txt>
              <Txt size={18} color={colors.muted} style={{ lineHeight: 28 }}>
                Three public-domain translations. Bookmarks, four highlight colours, and a note that is only yours. Text size stays where you left it.
              </Txt>
            </View>
            <ReaderMock />
          </View>
        </Reveal>
      </Band>

      <Band background="#12121A">
        <Reveal>
          <Txt size={14} weight={700} color="#C9C4FF" style={{ letterSpacing: 1.4 }}>
            JOHN 1:1
          </Txt>
          <Txt size={56} weight={700} serif color="#F6F5FF" style={{ maxWidth: 860, marginTop: 16 }}>
            In the beginning was the Word.
          </Txt>
          <Txt size={18} color="#C8C6D4" style={{ marginTop: 16, maxWidth: 560 }}>
            The same words, in a typeface made for reading, on a screen that can go dark when the room does.
          </Txt>
        </Reveal>
      </Band>

      <Band background={wash}>
        <Reveal>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
            <ReaderMock dark />
            <View style={{ flexGrow: 1, flexBasis: 320, minWidth: 0, gap: 14 }}>
              <Txt size={14} weight={700} color={colors.accent} style={{ letterSpacing: 1.4 }}>
                BEDTIME
              </Txt>
              <Txt size={48} weight={700} serif>
                Amber light, then quiet
              </Txt>
              <Txt size={18} color={colors.muted} style={{ lineHeight: 28 }}>
                A dim screen, a slower voice, and a sleep timer. At the end the reading fades. Free accounts can set up to 15 minutes. Nothing here is a score.
              </Txt>
              <Link href="/bedtime" asChild>
                <Button label="Preview bedtime" variant="quiet" />
              </Link>
            </View>
          </View>
        </Reveal>
      </Band>

      <Band background={colors.bg}>
        <Reveal>
          <Txt size={48} weight={700} serif style={{ maxWidth: 720 }}>
            A family, not a feed
          </Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 28 }}>
            {[
              ['A code, not a chat', 'Share a family code. There is no free-text messaging between accounts.'],
              ['Preset encouragement', 'Friends can send “Praying for you”. That is the whole message.'],
              ['Children later', 'Child profiles, with a parent’s consent, are part of the next phase.'],
            ].map(([title, body]) => (
              <View key={title} {...lift} style={{ flexGrow: 1, flexBasis: 260, borderRadius: 28, padding: 28, gap: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
                <Txt size={24} weight={700} serif>
                  {title}
                </Txt>
                <Txt color={colors.muted}>{body}</Txt>
              </View>
            ))}
          </View>
        </Reveal>
      </Band>

      <Band background={wash}>
        <Reveal>
          <Txt size={44} weight={700} serif>
            Plans
          </Txt>
          <Txt color={colors.muted} style={{ marginTop: 8, marginBottom: 24 }}>
            A teaser only. Nothing on this page is for sale, and the paywall says “Coming soon”.
          </Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            <View {...lift} style={{ flexGrow: 1, flexBasis: 300, backgroundColor: colors.bg, borderRadius: 28, padding: 32, gap: 10, borderWidth: 1, borderColor: colors.border }}>
              <Txt size={14} weight={700} color={colors.muted} style={{ letterSpacing: 1 }}>
                FREE
              </Txt>
              <Txt size={40} weight={700} serif>
                $0
              </Txt>
              <Txt>The whole Bible text, bookmarks, highlights, the device voice, and a 15 minute bedtime timer.</Txt>
            </View>
            <View {...lift} style={{ flexGrow: 1, flexBasis: 300, backgroundColor: colors.bg, borderRadius: 28, padding: 32, gap: 10, borderWidth: 2, borderColor: colors.accent }}>
              <Txt size={14} weight={700} color={colors.accent} style={{ letterSpacing: 1 }}>
                PREMIUM · PLANNED
              </Txt>
              <Txt size={40} weight={700} serif>
                Video stories
              </Txt>
              <Txt color={colors.muted}>Human or anime films, offline video, and a share with your family. The switch stays off until a plan exists.</Txt>
            </View>
          </View>
        </Reveal>
      </Band>

      <Band background={colors.bg} pad={48}>
        <View style={{ gap: 16 }}>
          <Txt weight={700}>Appearance</Txt>
          <ThemeSwitcher />
        </View>
        <View style={{ marginTop: 36, paddingTop: 28, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <View style={{ gap: 6 }}>
            <Txt weight={700}>Bible Storybook</Txt>
            <Txt color={colors.muted}>Public-domain text. No leaderboards.</Txt>
          </View>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <Link href="/privacy" asChild>
              <Pressable accessibilityRole="link" accessibilityLabel="Privacy" style={{ minHeight: 44, justifyContent: 'center' }}>
                <Txt weight={600} color={colors.accent}>
                  Privacy
                </Txt>
              </Pressable>
            </Link>
            <Link href="/terms" asChild>
              <Pressable accessibilityRole="link" accessibilityLabel="Terms" style={{ minHeight: 44, justifyContent: 'center' }}>
                <Txt weight={600} color={colors.accent}>
                  Terms
                </Txt>
              </Pressable>
            </Link>
          </View>
        </View>
      </Band>
    </Screen>
  )
}

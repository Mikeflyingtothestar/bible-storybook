import Feather from '@expo/vector-icons/Feather'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Platform, Pressable, View, type ViewStyle } from 'react-native'

import { Button, Column, Screen, ThemeSwitcher, Txt } from '@/src/components/ui'
import { useAppTheme } from '@/src/theme/ThemeProvider'

const FEATURES = [
  { icon: 'book-open' as const, title: 'Plain-text Bible', body: 'WEB, BSB, and KJV. Books, chapters, search, and a text size that stays where you left it.' },
  { icon: 'image' as const, title: 'Illustrated stories', body: 'Curated stories told in scenes. Pictures arrive after review; the words are ready to seed.' },
  { icon: 'volume-2' as const, title: 'Voiceover', body: 'Listen verse by verse with the device voice. The line you hear is the line that is highlighted.' },
  { icon: 'bookmark' as const, title: 'Bookmarks and notes', body: 'Save a verse, highlight it in four colours, or leave a private note.' },
  { icon: 'sun' as const, title: 'Light, dark, and sepia', body: 'Match the room. The choice is remembered on this device and on your profile.' },
  { icon: 'users' as const, title: 'Family and friends', body: 'Share a code, not a chat. Preset encouragements only. No free-text messages.' },
  { icon: 'mail' as const, title: 'A quiet sign-up', body: 'Email and a password, a magic link, Google, or Apple once those providers are switched on.' },
  { icon: 'film' as const, title: 'Video stories', body: 'Human and anime films stay off until the video flag and a Premium plan exist.' },
  { icon: 'moon' as const, title: 'Bedtime mode', body: 'A dim amber screen, a slower voice, and a sleep timer that fades the reading out.' },
]

const TIERS = [
  { name: 'Free', price: '$0', note: 'Planned', points: ['Whole Bible text', 'Bookmarks, highlights, notes', 'Device voice', 'Themes and a reading journey', 'Bedtime timer up to 15 minutes'] },
  { name: 'Plus', price: 'US$4.99', note: 'Planned · or $39.99/yr', points: ['All illustrated stories', 'Premium voices', 'Offline media', 'Unlimited plans', 'Family up to 6'] },
  { name: 'Premium', price: 'US$9.99', note: 'Planned · or $79.99/yr', points: ['Everything in Plus', 'Video stories, human or anime', 'Offline video', 'Share Premium with your family'] },
]

const FAQ = [
  { q: 'Which Bibles are included?', a: 'The World English Bible, the Berean Standard Bible, and the King James Version. All three are public domain.' },
  { q: 'Is there a subscription yet?', a: 'No. Prices on this page are planned. The paywall says “Coming soon”, and paid media stays behind feature flags.' },
  { q: 'Can children use it?', a: 'Child profiles, with a parent’s consent, are part of the next phase. This version is for the adult account holder.' },
  { q: 'Do you message other people?', a: 'No. Friends and family can send a preset encouragement such as “Praying for you”. There is no free-text chat.' },
]

const rise = (delay: number): ViewStyle | undefined =>
  Platform.OS === 'web' ? ({ animation: `rise 0.8s ease ${delay}ms both` } as ViewStyle) : undefined

export default function LandingPage() {
  const { colors, name } = useAppTheme()
  const ink = name === 'dark' ? colors.surface : '#12121A'
  const inkText = '#F6F5FF'
  return (
    <Screen testID="landing">
      <Column width={1120} style={{ paddingTop: 8, gap: 72 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingVertical: 14 }}>
          <Txt size={18} weight={700}>
            Bible Storybook
          </Txt>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Link href="/sign-in" asChild>
              <Pressable accessibilityRole="link" accessibilityLabel="Sign in" style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 14 }}>
                <Txt weight={600}>Sign in</Txt>
              </Pressable>
            </Link>
            <Link href="/sign-up" asChild>
              <Button label="Create account" testID="sign-up-link" />
            </Link>
          </View>
        </View>

        <View style={[{ gap: 28, paddingBottom: 12 }, rise(0)]}>
          <Txt size={15} weight={700} color={colors.accent} style={{ letterSpacing: 1.4 }}>
            A FAMILY BIBLE
          </Txt>
          <Txt size={64} weight={700} serif style={{ maxWidth: 820, letterSpacing: -1.2 }}>
            The Bible, told like a story
          </Txt>
          <Txt size={20} color={colors.muted} style={{ maxWidth: 620 }}>
            Read the text, listen as each verse is highlighted, and keep a gentle record of the days you showed up. No scores. No leaderboards.
          </Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingTop: 8 }}>
            <Link href="/bible" asChild>
              <Button label="Open the reader" testID="open-reader" />
            </Link>
            <Link href="/bible/GEN/1" asChild>
              <Button label="Read Genesis 1" variant="quiet" />
            </Link>
          </View>
        </View>

        <View
          style={{
            borderRadius: 32,
            overflow: 'hidden',
            minHeight: 320,
            backgroundColor: ink,
            padding: 36,
            justifyContent: 'flex-end',
            gap: 16,
          }}
        >
          <View style={{ position: 'absolute', top: -80, right: -40, width: 280, height: 280, borderRadius: 140, backgroundColor: '#6D5BFF55' }} />
          <View style={{ position: 'absolute', bottom: -60, left: 40, width: 180, height: 180, borderRadius: 90, backgroundColor: '#4F46E533' }} />
          <Txt size={14} weight={700} color="#C9C4FF" style={{ letterSpacing: 1.2 }}>
            JOHN 1:1
          </Txt>
          <Txt size={40} weight={700} serif color={inkText} style={{ maxWidth: 640 }}>
            In the beginning was the Word.
          </Txt>
          <Txt color="#C8C6D4">Three public-domain translations. One calm place to read them.</Txt>
        </View>

        <View style={{ gap: 18 }}>
          <Txt size={40} weight={700} serif>
            Nine ways to stay with the text
          </Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {FEATURES.map((feature) => (
              <View key={feature.title} style={{ width: 330, flexGrow: 1, backgroundColor: colors.surface, borderRadius: 24, padding: 24, gap: 12, borderWidth: 1, borderColor: colors.border }}>
                <Feather name={feature.icon} size={22} color={colors.accent} />
                <Txt size={22} weight={700}>
                  {feature.title}
                </Txt>
                <Txt color={colors.muted}>{feature.body}</Txt>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 18 }}>
          <Txt size={40} weight={700} serif>
            Plans
          </Txt>
          <Txt color={colors.muted}>Prices are planned. Nothing on this page is for sale.</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {TIERS.map((tier) => (
              <View key={tier.name} style={{ width: 300, flexGrow: 1, backgroundColor: colors.bg, borderRadius: 28, padding: 28, gap: 10, borderWidth: tier.name === 'Plus' ? 2 : 1, borderColor: tier.name === 'Plus' ? colors.accent : colors.border }}>
                <Txt size={13} weight={700} color={colors.goldText} style={{ letterSpacing: 1 }}>
                  {tier.note.toUpperCase()}
                </Txt>
                <Txt size={28} weight={700}>
                  {tier.name}
                </Txt>
                <Txt size={36} weight={700} serif>
                  {tier.price}
                </Txt>
                {tier.points.map((point) => (
                  <Txt key={point} color={colors.muted}>
                    {point}
                  </Txt>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Txt size={40} weight={700} serif>
            Questions
          </Txt>
          {FAQ.map((item) => (
            <Faq key={item.q} q={item.q} a={item.a} />
          ))}
        </View>

        <View style={{ gap: 12 }}>
          <Txt weight={700}>Appearance</Txt>
          <ThemeSwitcher />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 28, flexWrap: 'wrap', borderTopWidth: 1, borderTopColor: colors.border }}>
          <Txt weight={700}>Bible Storybook</Txt>
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
      </Column>
    </Screen>
  )
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  const { colors } = useAppTheme()
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      accessibilityLabel={q}
      onPress={() => setOpen((value) => !value)}
      style={{ borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 22, gap: 8, backgroundColor: colors.surface }}
    >
      <Txt size={18} weight={700}>
        {q}
      </Txt>
      {open ? <Txt color={colors.muted}>{a}</Txt> : null}
    </Pressable>
  )
}

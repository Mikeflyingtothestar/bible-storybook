import Feather from '@expo/vector-icons/Feather'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

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
  { icon: 'film' as const, title: 'Video stories', body: 'Human and anime films are wired up and kept off until the video flag and a Premium plan exist.' },
  { icon: 'moon' as const, title: 'Bedtime mode', body: 'A dim amber screen, a slower voice, and a sleep timer that fades the reading out.' },
]

const TIERS = [
  { name: 'Free', price: '$0', note: 'Planned', points: ['Whole Bible text', 'Bookmarks, highlights, notes', 'Device voice', 'Themes and a reading journey', 'Bedtime timer up to 15 minutes'] },
  { name: 'Plus', price: 'US$4.99/mo', note: 'Planned · or $39.99/yr', points: ['All illustrated stories', 'Premium voices', 'Offline media', 'Unlimited plans', 'Family up to 6'] },
  { name: 'Premium', price: 'US$9.99/mo', note: 'Planned · or $79.99/yr', points: ['Everything in Plus', 'Video stories, human or anime', 'Offline video', 'Share Premium with your family'] },
]

const FAQ = [
  { q: 'Which Bibles are included?', a: 'The World English Bible, the Berean Standard Bible, and the King James Version. All three are public domain. A few sample chapters are bundled so you can read before the full library is loaded.' },
  { q: 'Is there a subscription yet?', a: 'No. Prices on this page are planned. The paywall says “Coming soon”, and paid media stays behind feature flags.' },
  { q: 'Can children use it?', a: 'Child profiles, with a parent’s consent, are part of the next phase. This version is for the adult account holder.' },
  { q: 'Do you message other people?', a: 'No. Friends and family can send a preset encouragement such as “Praying for you”. There is no free-text chat.' },
]

export default function LandingPage() {
  const { colors } = useAppTheme()
  return (
    <Screen testID="landing">
      <Column width={1080} style={{ paddingTop: 18, gap: 28 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <Txt size={20} weight={800}>
            Bible Storybook
          </Txt>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Link href="/sign-in" asChild>
              <Pressable accessibilityRole="link" accessibilityLabel="Sign in" style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}>
                <Txt weight={700}>Sign in</Txt>
              </Pressable>
            </Link>
            <Link href="/sign-up" asChild>
              <Button label="Create account" testID="sign-up-link" />
            </Link>
          </View>
        </View>

        <View style={{ paddingVertical: 28, gap: 16 }}>
          <Txt size={18} weight={700} color={colors.accent}>
            A family Bible
          </Txt>
          <Txt size={48} weight={700} serif style={{ maxWidth: 720 }}>
            The Bible, told like a story
          </Txt>
          <Txt size={18} color={colors.muted} style={{ maxWidth: 640 }}>
            Read the text, listen as each verse is highlighted, and keep a gentle record of the days you showed up. No scores. No leaderboards.
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

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
          {FEATURES.map((feature) => (
            <View key={feature.title} style={{ width: 320, flexGrow: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 18, gap: 8, borderWidth: 1, borderColor: colors.border }}>
              <Feather name={feature.icon} size={22} color={colors.accent} />
              <Txt size={18} weight={800}>
                {feature.title}
              </Txt>
              <Txt color={colors.muted}>{feature.body}</Txt>
            </View>
          ))}
        </View>

        <View style={{ gap: 12 }}>
          <Txt size={32} weight={700} serif>
            Plans
          </Txt>
          <Txt color={colors.muted}>Prices are planned. Nothing is for sale in this version.</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
            {TIERS.map((tier) => (
              <View key={tier.name} style={{ width: 300, flexGrow: 1, backgroundColor: colors.bg, borderRadius: 16, padding: 18, gap: 8, borderWidth: 1, borderColor: colors.border }}>
                <Txt size={14} weight={800} color={colors.goldText}>
                  {tier.note}
                </Txt>
                <Txt size={24} weight={800}>
                  {tier.name}
                </Txt>
                <Txt size={20} weight={700} serif>
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

        <View style={{ gap: 8 }}>
          <Txt size={32} weight={700} serif>
            Questions
          </Txt>
          {FAQ.map((item) => (
            <Faq key={item.q} q={item.q} a={item.a} />
          ))}
        </View>

        <View style={{ gap: 10, paddingBottom: 12 }}>
          <Txt weight={700}>Appearance</Txt>
          <ThemeSwitcher />
        </View>

        <View style={{ flexDirection: 'row', gap: 16, paddingVertical: 24, flexWrap: 'wrap' }}>
          <Link href="/privacy" asChild>
            <Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}>
              <Txt weight={700} color={colors.accent}>
                Privacy
              </Txt>
            </Pressable>
          </Link>
          <Link href="/terms" asChild>
            <Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}>
              <Txt weight={700} color={colors.accent}>
                Terms
              </Txt>
            </Pressable>
          </Link>
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
      onPress={() => setOpen((value) => !value)}
      style={{ borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 8, backgroundColor: colors.surface }}
    >
      <Txt weight={800}>{q}</Txt>
      {open ? <Txt color={colors.muted}>{a}</Txt> : null}
    </Pressable>
  )
}

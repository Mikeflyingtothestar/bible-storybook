import { useState } from 'react'
import { Modal, Pressable, Share, Text, TextInput, View } from 'react-native'

import { useAuth } from '../auth/AuthProvider'
import { lookupVerseId } from '../bible/load'
import { referenceLabel } from '../bible/sample'
import { fontSans } from './ui'
import { supabase } from '../lib/supabase'
import { useRouter } from 'expo-router'
import { HIGHLIGHT_COLORS, themes, type HighlightColor } from '../theme/tokens'
import { useAppTheme } from '../theme/ThemeProvider'

export function VerseSheet({
  visible,
  onClose,
  version,
  book,
  chapter,
  verse,
}: {
  visible: boolean
  onClose: () => void
  version: string
  book: string
  chapter: number
  verse: { number: number; text: string; id: number | null } | null
}) {
  const { colors } = useAppTheme()
  const { user } = useAuth()
  const router = useRouter()
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  if (!verse) return null
  const reference = referenceLabel(book, chapter, verse.number)
  const shareText = `${verse.text} — ${reference} (${version})`

  async function verseId(): Promise<number | null> {
    if (verse?.id) return verse.id
    return lookupVerseId(version, `${book}.${chapter}.${verse?.number ?? 0}`)
  }

  async function requireVerse(): Promise<number | null> {
    if (!user) {
      setStatus('Sign in to save this verse.')
      return null
    }
    const id = await verseId()
    if (!id) setStatus('This verse is not in the library yet, so it cannot be saved. The full text is loading soon.')
    return id
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable accessibilityLabel="Close verse actions" onPress={onClose} style={{ flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' }}>
        <Pressable onPress={() => undefined} style={{ backgroundColor: colors.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, gap: 12 }}>
          <Text style={{ color: colors.muted, fontFamily: fontSans(700) }}>{reference}</Text>
          <Text style={{ color: colors.text, fontFamily: fontSans(), fontSize: 16, lineHeight: 24 }}>{verse.text}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Action
              label="Bookmark"
              testID="bookmark-verse"
              onPress={() => {
                void (async () => {
                  const id = await requireVerse()
                  if (!id || !user) return
                  const { error } = await supabase.from('bookmarks').insert({ user_id: user.id, verse_id: id, label: reference })
                  setStatus(error ? 'That bookmark could not be saved.' : 'Bookmarked.')
                })()
              }}
            />
            <Action
              label="Copy"
              onPress={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) void navigator.clipboard.writeText(shareText)
                setStatus('Copied.')
              }}
            />
            <Action
              label="Share"
              onPress={() => {
                void Share.share({ message: shareText })
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {HIGHLIGHT_COLORS.map((color) => (
              <Pressable
                key={color}
                accessibilityRole="button"
                accessibilityLabel={`Highlight ${color}`}
                onPress={() => {
                  void (async () => {
                    const id = await requireVerse()
                    if (!id || !user) return
                    const { error } = await supabase.from('highlights_notes').insert({
                      user_id: user.id,
                      verse_id: id,
                      color,
                      note: note.trim() || null,
                    })
                    setStatus(error ? 'That highlight could not be saved.' : `Highlighted in ${color}.`)
                  })()
                }}
                style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: themes.light.highlight[color as HighlightColor] }}
              />
            ))}
          </View>
          <TextInput
            accessibilityLabel="Note"
            value={note}
            onChangeText={setNote}
            placeholder="A private note"
            placeholderTextColor={colors.muted}
            multiline
            style={{ minHeight: 72, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, color: colors.text, fontFamily: fontSans() }}
          />
          <Action
            label="Save note"
            testID="save-note"
            onPress={() => {
              void (async () => {
                const id = await requireVerse()
                if (!id || !user) return
                const { error } = await supabase.from('highlights_notes').insert({
                  user_id: user.id,
                  verse_id: id,
                  color: 'yellow',
                  note: note.trim(),
                })
                setStatus(error ? 'That note could not be saved.' : 'Note saved.')
              })()
            }}
          />
          {status ? <Text style={{ color: colors.text, fontFamily: fontSans(600) }}>{status}</Text> : null}
          {status === 'Sign in to save this verse.' ? (
            <Action label="Sign in" testID="verse-sign-in" onPress={() => { onClose(); router.push('/sign-in') }} />
          ) : null}
          <Action label="Close" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  )
}

function Action({ label, onPress, testID }: { label: string; onPress: () => void; testID?: string }) {
  const { colors } = useAppTheme()
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      onPress={onPress}
      style={{ minHeight: 44, paddingHorizontal: 14, borderRadius: 12, backgroundColor: colors.surface, justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
    >
      <Text style={{ color: colors.text, fontFamily: fontSans(700) }}>{label}</Text>
    </Pressable>
  )
}

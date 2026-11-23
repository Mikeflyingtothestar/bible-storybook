import Feather from '@expo/vector-icons/Feather'
import { Link, type Href } from 'expo-router'
import { forwardRef, type ComponentProps } from 'react'
import { Platform, Pressable, ScrollView, Text, TextInput, View, type TextStyle, type ViewStyle } from 'react-native'

import { useAppTheme } from '../theme/ThemeProvider'
import type { ThemeColors } from '../theme/tokens'

export function fontSans(weight: 400 | 600 | 700 | 800 = 400): string | undefined {
  if (weight >= 700) return Platform.OS === 'web' ? 'Inter_700, Inter, sans-serif' : 'Inter_700'
  if (weight === 600) return Platform.OS === 'web' ? 'Inter_600, Inter, sans-serif' : 'Inter_600'
  return Platform.OS === 'web' ? 'Inter_400, Inter, sans-serif' : 'Inter_400'
}

export function fontSerif(weight: 400 | 600 | 700 = 400): string | undefined {
  if (weight >= 700) return Platform.OS === 'web' ? 'Playfair_700, Georgia, serif' : 'Playfair_700'
  return Platform.OS === 'web' ? 'Playfair_500, Georgia, serif' : 'Playfair_500'
}

export function Screen({
  children,
  scroll = true,
  testID,
}: {
  children: React.ReactNode
  scroll?: boolean
  testID?: string
}) {
  const { colors } = useAppTheme()
  return (
    <View testID={testID} style={{ flex: 1, backgroundColor: colors.bg }} className="flex-1">
      {scroll ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </View>
  )
}

export function Column({ children, width = 760, style }: { children: React.ReactNode; width?: number; style?: ViewStyle }) {
  return <View style={[{ width: '100%', maxWidth: width, alignSelf: 'center', paddingHorizontal: 20 }, style]}>{children}</View>
}

export function Txt({
  children,
  size = 16,
  weight = 400,
  serif = false,
  color,
  style,
}: {
  children: React.ReactNode
  size?: number
  weight?: 400 | 600 | 700 | 800
  serif?: boolean
  color?: string
  style?: TextStyle
}) {
  const { colors } = useAppTheme()
  return (
    <Text
      style={[
        {
          color: color ?? colors.text,
          fontSize: size,
          lineHeight: Math.round(size * (serif ? 1.7 : 1.45)),
          fontFamily: serif ? fontSerif(weight === 800 ? 700 : weight) : fontSans(weight),
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

type ButtonProps = Omit<ComponentProps<typeof Pressable>, 'children'> & {
  label: string
  variant?: 'primary' | 'quiet' | 'danger'
  /** Web address passed by expo-router Link. Pressable turns this into a real anchor. */
  href?: string
  /** Web click handler passed by expo-router Link (`asChild` uses onClick, not onPress). */
  onClick?: (event: unknown) => void
}

export const Button = forwardRef<View, ButtonProps>(function Button(
  { label, variant = 'primary', testID, disabled, style, href, onClick, ...rest },
  ref,
) {
  const { colors } = useAppTheme()
  const background = variant === 'primary' ? colors.accent : colors.surface
  const text = variant === 'primary' ? colors.onAccent : variant === 'danger' ? colors.danger : colors.text
  return (
    <Pressable
      ref={ref as never}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      disabled={disabled}
      {...rest}
      {...({ href, onClick } as object)}
      style={(state) => [
        typeof style === 'function' ? style(state) : style,
        {
          minHeight: 48,
          paddingHorizontal: 22,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: background,
          borderWidth: variant === 'primary' ? 0 : 1,
          borderColor: variant === 'danger' ? colors.danger : colors.border,
          opacity: disabled ? 0.5 : state.pressed ? 0.88 : 1,
        },
      ]}
    >
      <Text style={{ color: text, fontFamily: fontSans(700), fontSize: 15, letterSpacing: 0.2 }}>{label}</Text>
    </Pressable>
  )
})

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
  keyboard,
  testID,
}: {
  label: string
  value: string
  onChangeText: (value: string) => void
  placeholder?: string
  secure?: boolean
  keyboard?: 'email-address' | 'default'
  testID?: string
}) {
  const { colors } = useAppTheme()
  return (
    <View style={{ gap: 6 }}>
      <Txt size={14} weight={700} color={colors.muted}>
        {label}
      </Txt>
      <TextInput
        accessibilityLabel={label}
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secure}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboard === 'email-address' ? 'email-address' : 'default'}
        style={{
          minHeight: 48,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          color: colors.text,
          paddingHorizontal: 14,
          fontSize: 16,
          fontFamily: fontSans(),
        }}
      />
    </View>
  )
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { colors } = useAppTheme()
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 24,
          padding: 22,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 8,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

export function ThemeSwitcher() {
  const { preference, setPreference, colors } = useAppTheme()
  const options: { id: 'system' | 'light' | 'dark' | 'sepia'; label: string }[] = [
    { id: 'system', label: 'System' },
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'sepia', label: 'Sepia' },
  ]
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = preference === option.id
        return (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option.label} theme`}
            testID={`theme-${option.id}`}
            onPress={() => setPreference(option.id)}
            style={{
              minHeight: 44,
              paddingHorizontal: 14,
              borderRadius: 999,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected ? colors.accent : colors.surface,
              borderWidth: 1,
              borderColor: selected ? colors.accent : colors.border,
            }}
          >
            <Text style={{ color: selected ? colors.onAccent : colors.text, fontFamily: fontSans(700) }}>{option.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export function AppBar({ title, backHref }: { title: string; backHref?: Href }) {
  const { colors } = useAppTheme()
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
        {backHref ? (
          <Link href={backHref} asChild>
            <Pressable accessibilityRole="link" accessibilityLabel="Back" style={{ minWidth: 44, minHeight: 44, justifyContent: 'center' }}>
              <Feather name="arrow-left" size={22} color={colors.text} />
            </Pressable>
          </Link>
        ) : null}
        <Txt size={20} weight={800} style={{ flex: 1 }}>
          {title}
        </Txt>
      </View>
      <Link href="/bedtime" asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Bedtime mode"
          testID="open-bedtime"
          style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <Feather name="moon" size={22} color={colors.accent} />
        </Pressable>
      </Link>
    </View>
  )
}

export function bannerColors(colors: ThemeColors): ViewStyle {
  return { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14 }
}

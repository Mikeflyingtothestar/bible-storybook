import { createElement } from 'react'
import { Image, Linking, Platform, Pressable, type ImageSourcePropType } from 'react-native'

import { useAppTheme } from '@/src/theme/ThemeProvider'

import { Txt, fontSans } from './ui'

export function ArtImage({
  source,
  alt,
  eager = false,
}: {
  source: ImageSourcePropType
  alt: string
  eager?: boolean
}) {
  const direct = typeof source === 'object' && source && 'uri' in source ? source.uri : undefined
  const resolver = (Image as { resolveAssetSource?: (value: ImageSourcePropType) => { uri?: string } | undefined }).resolveAssetSource
  const uri = direct ?? (typeof resolver === 'function' ? resolver(source)?.uri : undefined)
  if (Platform.OS === 'web' && uri) {
    return createElement('img', {
      src: uri,
      alt,
      width: 1600,
      height: 1000,
      loading: eager ? 'eager' : 'lazy',
      fetchpriority: eager ? 'high' : 'auto',
      decoding: 'async',
      style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    })
  }
  return <Image source={source} accessibilityLabel={alt} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
}

export function CommonsLink({ href }: { href: string }) {
  const { colors } = useAppTheme()
  const label = 'Public domain, via Wikimedia Commons'
  if (Platform.OS === 'web') {
    return createElement(
      'a',
      {
        href,
        target: '_blank',
        rel: 'noreferrer',
        style: { color: colors.accent, fontFamily: fontSans(600), fontSize: 14, textDecoration: 'underline' },
      },
      label,
    )
  }
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={label} onPress={() => void Linking.openURL(href)}>
      <Txt weight={600} color={colors.accent}>
        {label}
      </Txt>
    </Pressable>
  )
}

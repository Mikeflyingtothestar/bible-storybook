import { View, type ImageSourcePropType, type ViewStyle } from 'react-native'

import { ArtImage } from './ArtworkFrame'

export function Photo({
  source,
  alt,
  height = 180,
  radius = 24,
  eager = false,
  style,
}: {
  source: ImageSourcePropType
  alt: string
  height?: number
  radius?: number
  eager?: boolean
  style?: ViewStyle
}) {
  return (
    <View style={[{ height, borderRadius: radius, overflow: 'hidden', width: '100%' }, style]}>
      <ArtImage source={source} alt={alt} eager={eager} />
    </View>
  )
}

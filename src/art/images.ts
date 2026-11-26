import type { ImageSourcePropType } from 'react-native'

export const ART_SOURCES: Record<string, ImageSourcePropType> = {
  priscilla: require('../../assets/art/priscilla.webp'),
  ravenna: require('../../assets/art/ravenna.webp'),
  kells: require('../../assets/art/kells.webp'),
  giotto: require('../../assets/art/giotto.webp'),
  rublev: require('../../assets/art/rublev.webp'),
  angelico: require('../../assets/art/angelico.webp'),
  rembrandt: require('../../assets/art/rembrandt.webp'),
  dore: require('../../assets/art/dore.webp'),
}

/** Original illustration for the landing hero. Not part of the Commons gallery. */
export const HERO_BASILICA = require('../../assets/art/davinci-basilica.webp') as ImageSourcePropType

export const NATURE = {
  sunrise: require('../../assets/art/sunrise-sky.webp') as ImageSourcePropType,
  water: require('../../assets/art/still-water.webp') as ImageSourcePropType,
  leaves: require('../../assets/art/soft-leaves.webp') as ImageSourcePropType,
}

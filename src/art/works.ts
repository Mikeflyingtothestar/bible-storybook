export type Artwork = {
  id: string
  title: string
  artist: string
  date: string
  alt: string
  /** Wikimedia Commons file page. The file’s license short name is Public domain. */
  page: string
}

export const ARTWORKS: Artwork[] = [
  {
    id: 'priscilla',
    title: 'The Good Shepherd',
    artist: 'Unknown',
    date: 'Second half of the 3rd century',
    alt: 'Ceiling fresco of the Good Shepherd carrying a sheep, with doves and olive branches, from the Catacomb of Priscilla in Rome.',
    page: 'https://commons.wikimedia.org/wiki/File:Good_shepherd_01_small.jpg',
  },
  {
    id: 'ravenna',
    title: 'Court of Emperor Justinian',
    artist: 'Mosaicists of San Vitale',
    date: 'Before 547',
    alt: 'Ravenna mosaic of Emperor Justinian with Archbishop Maximian, clergy, and guards in the Basilica of San Vitale.',
    page: 'https://commons.wikimedia.org/wiki/File:Meister_von_San_Vitale_in_Ravenna_003.jpg',
  },
  {
    id: 'kells',
    title: 'Chi Rho page',
    artist: 'Scribes of the Book of Kells',
    date: 'About 800',
    alt: 'Illuminated Chi Rho monogram from folio 34r of the Book of Kells, filled with interlaced spirals and small figures.',
    page: 'https://commons.wikimedia.org/wiki/File:KellsFol034rChiRhoMonogram.jpg',
  },
  {
    id: 'giotto',
    title: 'Lamentation',
    artist: 'Giotto',
    date: 'About 1304–1306',
    alt: 'Giotto’s fresco of mourners around the body of Christ, from the Scrovegni Chapel in Padua.',
    page: 'https://commons.wikimedia.org/wiki/File:Giotto_-_Scrovegni_-_-36-_-_Lamentation_(The_Mourning_of_Christ)_adj.jpg',
  },
  {
    id: 'rublev',
    title: 'The Trinity',
    artist: 'Andrei Rublev',
    date: 'About 1411',
    alt: 'Andrei Rublev’s icon of three angels seated at a table, the Hospitality of Abraham, also called The Trinity.',
    page: 'https://commons.wikimedia.org/wiki/File:Andrej_Rubl%C3%ABv_001.jpg',
  },
  {
    id: 'angelico',
    title: 'Annunciation',
    artist: 'Fra Angelico',
    date: 'About 1438–1450',
    alt: 'Fra Angelico’s fresco of the angel Gabriel greeting Mary, in the north corridor of the convent of San Marco, Florence.',
    page: 'https://commons.wikimedia.org/wiki/File:Angelico_-_Annunciation_-_San_Marco_north_corridor.jpg',
  },
  {
    id: 'rembrandt',
    title: 'The Return of the Prodigal Son',
    artist: 'Rembrandt',
    date: 'About 1668',
    alt: 'Rembrandt’s painting of a father embracing his kneeling son, with onlookers standing in the shadow.',
    page: 'https://commons.wikimedia.org/wiki/File:Rembrandt_Harmensz._van_Rijn_-_The_Return_of_the_Prodigal_Son.jpg',
  },
  {
    id: 'dore',
    title: 'The Creation of Light',
    artist: 'Gustave Doré',
    date: '1866',
    alt: 'Gustave Doré’s engraving of light breaking through dark clouds over the waters, signed G. Doré.',
    page: 'https://commons.wikimedia.org/wiki/File:001.The_Creation_of_Light.jpg',
  },
]

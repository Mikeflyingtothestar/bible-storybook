import { describe, expect, it } from 'vitest'

import { cleanUsfmText, parseBsb, parseUsfm } from './parse'

const GENESIS = String.raw`
\id GEN World English Bible (WEB)
\h Genesis
\c 1
\p
\v 1 \w In|strong="H8064"\w* \w the|strong="H1254"\w* \w beginning|strong="H7225"\w*, \w God|strong="H8064"\w*\f + \fr 1:1 \ft The Hebrew word rendered “God” is “\+wh אֱלֹהִ֑ים\+wh*” (Elohim).\f* \w created|strong="H1254"\w* \w the|strong="H1254"\w* \w heavens|strong="H8064"\w* \w and|strong="H8064"\w* \w the|strong="H1254"\w* \w earth|strong="H8064"\w*.
\v 2 \w The|strong="H6440"\w* earth \w was|strong="H1961"\w* \w formless|strong="H8414"\w*.
\s A heading that must not leak
\v 3 God said, “\w Let|strong="H1961"\w* there be light.”
`

describe('usfm cleaning', () => {
  it('strips Strong’s numbers, footnotes, and headings', () => {
    const book = parseUsfm(GENESIS)
    expect(book?.osis).toBe('GEN')
    expect(book?.chapters[0]?.verses.map((verse) => verse.text)).toEqual([
      'In the beginning, God created the heavens and the earth.',
      'The earth was formless.',
      'God said, “Let there be light.”',
    ])
    expect(cleanUsfmText(String.raw`\add was\add* upon the \w face|strong="H6440"\w*`)).toBe('was upon the face')
  })

  it('ignores front matter that is not a canon book', () => {
    expect(parseUsfm('\\id FRT Preface\n\\c 1\n\\v 1 Hello')).toBeNull()
  })

  it('reads Berean lines', () => {
    const books = parseBsb('Intro\nGenesis 1:1\tIn the beginning God created the heavens and the earth.\nPsalm 23:1\tThe LORD is my shepherd.\n')
    expect(books.map((book) => book.osis)).toEqual(['GEN', 'PSA'])
    expect(books[1]?.chapters[0]?.verses[0]?.text).toMatch(/shepherd/)
  })
})

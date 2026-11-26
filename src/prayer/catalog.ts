import { requireVerse, type CitedVerse } from '../wellness/bundled'

export type PrayerSlot = 'morning' | 'evening' | 'meals' | 'situations'

export type GuidedPrayer = {
  id: string
  slot: PrayerSlot
  title: string
  body: string
  verse: CitedVerse
}

export const PRAYERS: GuidedPrayer[] = [
  {
    id: 'morning-light',
    slot: 'morning',
    title: 'Morning',
    body: 'A quiet start. Ask for enough light for this day, and for attention to the people you will meet.',
    verse: requireVerse('GEN.1.3'),
  },
  {
    id: 'evening-rest',
    slot: 'evening',
    title: 'Evening',
    body: 'Set the day down. Name one good thing, and one thing you are leaving until tomorrow.',
    verse: requireVerse('PSA.23.2'),
  },
  {
    id: 'meal-thanks',
    slot: 'meals',
    title: 'At the table',
    body: 'Pause before you eat. Thankfulness can be as small as noticing the food in front of you.',
    verse: requireVerse('MAT.6.11'),
  },
  {
    id: 'when-anxious',
    slot: 'situations',
    title: 'When you feel anxious',
    body: 'You do not have to solve tomorrow in this sitting. Say what you need for the next hour.',
    verse: requireVerse('MAT.6.34'),
  },
  {
    id: 'when-grieving',
    slot: 'situations',
    title: 'When you are grieving',
    body: 'There is room here for sadness. You do not have to make it smaller than it is.',
    verse: requireVerse('PSA.23.4'),
  },
  {
    id: 'for-someone',
    slot: 'situations',
    title: 'For someone else',
    body: 'Hold one person in mind. Ask that they would be kept, going out and coming in.',
    verse: requireVerse('PSA.121.8'),
  },
]

export function prayersFor(slot: PrayerSlot): GuidedPrayer[] {
  return PRAYERS.filter((prayer) => prayer.slot === slot)
}

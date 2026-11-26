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
    body: 'Begin before the day gets loud. Ask for enough light for what is actually in front of you, and for a little kindness toward the people you will meet. You do not need the perfect words.',
    verse: requireVerse('GEN.1.3'),
  },
  {
    id: 'evening-rest',
    slot: 'evening',
    title: 'Evening',
    body: 'Set the day down without reviewing every mistake. Name one good thing, and one thing you are willing to leave until tomorrow. Rest is allowed to be simple.',
    verse: requireVerse('PSA.23.2'),
  },
  {
    id: 'meal-thanks',
    slot: 'meals',
    title: 'At the table',
    body: 'Pause before you eat, even for one breath. Thankfulness can be as small as noticing the food in front of you. Nothing else has to be solved at the table.',
    verse: requireVerse('MAT.6.11'),
  },
  {
    id: 'when-anxious',
    slot: 'situations',
    title: 'When you feel anxious',
    body: 'You do not have to solve tomorrow in this sitting. Say what you need for the next hour, and let the rest wait. Worry can be loud without being in charge.',
    verse: requireVerse('MAT.6.34'),
  },
  {
    id: 'when-grieving',
    slot: 'situations',
    title: 'When you are grieving',
    body: 'There is room here for sadness, and you do not have to make it smaller than it is. Stay with one breath and one verse. You are not asked to feel better on a schedule.',
    verse: requireVerse('PSA.23.4'),
  },
  {
    id: 'for-someone',
    slot: 'situations',
    title: 'For someone else',
    body: 'Hold one person in mind, just as they are. Ask that they would be kept, going out and coming in. A short prayer for someone else is still a full prayer.',
    verse: requireVerse('PSA.121.8'),
  },
]

export function prayersFor(slot: PrayerSlot): GuidedPrayer[] {
  return PRAYERS.filter((prayer) => prayer.slot === slot)
}

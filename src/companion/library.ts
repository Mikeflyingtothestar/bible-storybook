import type { TopicId } from '../wellness/topics'

export type TopicGuide = {
  id: TopicId
  title: string
  refs: string[]
  reflection: string
  prayer: string
}

/** Curated from the bundled World English Bible. Each topic cites at least three verses. */
export const TOPIC_GUIDES: TopicGuide[] = [
  {
    id: 'anxiety',
    title: 'Anxiety',
    refs: ['MAT.6.25', 'MAT.6.34', 'MAT.6.26'],
    reflection: 'The reading names the worry, then makes tomorrow wait. Care is pictured as already happening, not as something you have to earn before you rest.',
    prayer: 'Let me leave tomorrow until tomorrow. Give me enough for what is actually in front of me.',
  },
  {
    id: 'grief',
    title: 'Grief',
    refs: ['PSA.23.4', 'JHN.1.5', 'PSA.23.3'],
    reflection: 'The valley is not erased. The psalm says you do not walk it alone, and John says the darkness has not overcome the light.',
    prayer: 'Stay with me in what hurts. I do not need the feeling to be finished before I ask for company.',
  },
  {
    id: 'forgiveness',
    title: 'Forgiveness',
    refs: ['MAT.6.12', 'MAT.6.14', 'MAT.6.15'],
    reflection: 'The prayer puts being forgiven and forgiving in the same sentence. You can begin with one release, even if the rest is still sore.',
    prayer: 'Forgive me what I owe, and help me loosen what I am holding against someone else.',
  },
  {
    id: 'purpose',
    title: 'Purpose',
    refs: ['GEN.1.27', 'JHN.1.4', 'MAT.6.33'],
    reflection: 'The text calls a human life an image and a light. It does not ask you to prove that before the next quiet step.',
    prayer: 'Show me the next faithful thing, not the whole map. Let that be enough for today.',
  },
  {
    id: 'gratitude',
    title: 'Gratitude',
    refs: ['PSA.23.6', 'GEN.1.31', 'PSA.23.5'],
    reflection: 'Goodness is described as following you, and the creation story stops to call the work very good. Gratitude here is noticing, not performing.',
    prayer: 'Let me name one ordinary good thing from this day, without turning it into a speech.',
  },
  {
    id: 'rest',
    title: 'Rest',
    refs: ['PSA.23.2', 'PSA.23.3', 'GEN.1.5'],
    reflection: 'Rest is a place you are led: green pasture, still water, and a day that includes evening. It is not a test you pass.',
    prayer: 'Lead me to water that is not rushing. Let the day actually end.',
  },
  {
    id: 'courage',
    title: 'Courage',
    refs: ['PSA.23.4', 'PSA.121.2', 'PSA.121.7'],
    reflection: 'Courage in these lines is company in a dark place, and help that does not come from the hills themselves.',
    prayer: 'I do not have to feel brave. Walk with me through the part I am afraid of.',
  },
  {
    id: 'peace',
    title: 'Peace',
    refs: ['PSA.23.2', 'PSA.121.7', 'PSA.121.8'],
    reflection: 'Peace here is a keeper who stays, covering going out and coming in. You can set one worry down for a minute.',
    prayer: 'Keep my going out and my coming in. Let the rest of the noise wait.',
  },
  {
    id: 'loneliness',
    title: 'Loneliness',
    refs: ['PSA.23.4', 'PSA.121.4', 'JHN.1.5'],
    reflection: 'The keeper does not slumber, and the valley is walked with someone. Loneliness is named by the company the verses refuse to remove.',
    prayer: 'I feel alone. Be the company these lines talk about, even if the room stays quiet.',
  },
  {
    id: 'anger',
    title: 'Anger',
    refs: ['MAT.6.12', 'MAT.6.14', 'PSA.23.5'],
    reflection: 'The prayer asks for release, and the psalm sets a table even with trouble nearby. Anger can be told the truth without being the whole day.',
    prayer: 'I am angry. Help me not make the anger the only word I have left.',
  },
]

export function guideFor(id: TopicId): TopicGuide {
  const guide = TOPIC_GUIDES.find((item) => item.id === id)
  if (!guide) throw new Error(`Missing topic guide ${id}`)
  return guide
}

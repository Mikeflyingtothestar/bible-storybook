import { requireVerse, type CitedVerse } from '../wellness/bundled'

export type Quiz = { question: string; choices: [string, string, string]; answer: 0 | 1 | 2 }

export type Lesson = {
  id: string
  title: string
  minutes: number
  body: string
  verse: CitedVerse
  quiz: Quiz[]
}

export type Programme = {
  id: string
  title: string
  summary: string
  premium: boolean
  lessons: Lesson[]
}

function lesson(id: string, title: string, ref: string, body: string, quiz: Quiz | Quiz[]): Lesson {
  return { id, title, minutes: 3, body, verse: requireVerse(ref), quiz: Array.isArray(quiz) ? quiz : [quiz] }
}

export const PROGRAMMES: Programme[] = [
  {
    id: 'anxiety',
    title: 'Anxiety',
    summary: 'Five short readings when worry is loud.',
    premium: false,
    lessons: [
      lesson('worry', 'Don’t be anxious', 'MAT.6.25', 'The verse names the worry, then makes it smaller than a life.', [
        { question: 'What does the verse say not to be anxious for?', choices: ['Your life', 'A festival', 'A journey'], answer: 0 },
        { question: 'What clothing question does it set aside?', choices: ['What you will wear', 'Which colour is holy', 'Who made the cloth'], answer: 0 },
        { question: 'Is the worry treated as the whole of life?', choices: ['No', 'Yes', 'Only on feast days'], answer: 0 },
      ]),
      lesson('birds', 'The birds', 'MAT.6.26', 'Care is pictured as already happening, not as something you earn.', [
        { question: 'Who feeds the birds?', choices: ['Your heavenly Father', 'The market', 'No one'], answer: 0 },
        { question: 'What do the birds not do?', choices: ['Sow or reap', 'Fly', 'Sing'], answer: 0 },
        { question: 'How are people compared with the birds?', choices: ['Of more value', 'Of less value', 'The same species'], answer: 0 },
      ]),
      lesson('lilies', 'The lilies', 'MAT.6.28', 'Clothing is the example, and the flowers do not toil for it.', [
        { question: 'What does the verse say to consider?', choices: ['The lilies of the field', 'The market stalls', 'A wardrobe'], answer: 0 },
        { question: 'What do the lilies not do?', choices: ['Toil or spin', 'Grow', 'Stand in a field'], answer: 0 },
        { question: 'What is the worry about?', choices: ['Clothing', 'A census', 'A storm'], answer: 0 },
      ]),
      lesson('kingdom', 'Seek first', 'MAT.6.33', 'The ask is for God’s Kingdom first, and the rest is added rather than chased.', [
        { question: 'What should be sought first?', choices: ['God’s Kingdom and his righteousness', 'A larger barn', 'Tomorrow’s menu'], answer: 0 },
        { question: 'What is given as well?', choices: ['All these things', 'A new name', 'A crown'], answer: 0 },
        { question: 'Is the verse a demand to earn the gift?', choices: ['No, it says they will be given', 'Yes, by toiling', 'Only if you fast'], answer: 0 },
      ]),
      lesson('tomorrow', 'Tomorrow', 'MAT.6.34', 'Tomorrow can wait until tomorrow.', [
        { question: 'What is sufficient?', choices: ['Each day’s own evil', 'A perfect plan', 'More hours'], answer: 0 },
        { question: 'Who will be anxious for tomorrow?', choices: ['Tomorrow itself', 'The birds', 'The lilies'], answer: 0 },
        { question: 'What does the verse say not to be anxious for?', choices: ['Tomorrow', 'Today’s bread', 'The evening'], answer: 0 },
      ]),
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep',
    summary: 'Five quiet lines for the end of a day.',
    premium: false,
    lessons: [
      lesson('waters', 'Still waters', 'PSA.23.2', 'Rest is a place you are led, not a test you pass.', [
        { question: 'Where is the speaker led?', choices: ['Beside still waters', 'Into a city', 'Up a wall'], answer: 0 },
        { question: 'Where do they lie down?', choices: ['In green pastures', 'On a roof', 'In the market'], answer: 0 },
        { question: 'Who does the leading?', choices: ['The shepherd, the LORD', 'The singer alone', 'The hills'], answer: 0 },
      ]),
      lesson('valley', 'The valley', 'PSA.23.4', 'The dark place is named, and so is company.', [
        { question: 'What will the speaker not fear?', choices: ['Evil', 'Sleep', 'Rain'], answer: 0 },
        { question: 'Why is the fear set down?', choices: ['Because you are with me', 'Because the valley is gone', 'Because it is noon'], answer: 0 },
        { question: 'What comforts?', choices: ['Rod and staff', 'A locked gate', 'Silence only'], answer: 0 },
      ]),
      lesson('keeper', 'A keeper who stays awake', 'PSA.121.4', 'Someone else can keep watch.', [
        { question: 'Who does not slumber?', choices: ['He who keeps Israel', 'The singer', 'The hills'], answer: 0 },
        { question: 'What else will he not do?', choices: ['Sleep', 'Listen', 'Create'], answer: 0 },
        { question: 'Is the watch handed to you alone?', choices: ['No', 'Yes', 'Only on feast days'], answer: 0 },
      ]),
      lesson('shade', 'Shade', 'PSA.121.5', 'The keeper is also shade, close at hand.', [
        { question: 'Who is your keeper?', choices: ['The LORD', 'The sun', 'The moon'], answer: 0 },
        { question: 'Where is the shade?', choices: ['On your right hand', 'Over the city wall', 'Behind the hills'], answer: 0 },
        { question: 'What role does the verse give the LORD?', choices: ['Keeper and shade', 'A distant star', 'A hired watchman'], answer: 0 },
      ]),
      lesson('coming', 'Coming in', 'PSA.121.8', 'The day can close. Going out and coming in are both kept.', [
        { question: 'What is kept?', choices: ['Going out and coming in', 'Only the morning', 'Only work'], answer: 0 },
        { question: 'How long does the keeping last?', choices: ['From this time forward, and forever more', 'Until noon', 'For one night'], answer: 0 },
        { question: 'Does the blessing cover coming home?', choices: ['Yes', 'No', 'Only leaving'], answer: 0 },
      ]),
    ],
  },
  {
    id: 'prayer-habit',
    title: 'Prayer habit',
    summary: 'Three small ways to pray without performing it.',
    premium: false,
    lessons: [
      lesson('room', 'A shut door', 'MAT.6.6', 'The picture is a room, not a crowd.', { question: 'Where does the verse say to pray?', choices: ['In your inner room', 'On a stage', 'In the market'], answer: 0 }),
      lesson('bread', 'Daily bread', 'MAT.6.11', 'The ask is for today.', { question: 'What bread is asked for?', choices: ['Daily bread', 'Festival bread', 'Leftovers'], answer: 0 }),
      lesson('words', 'Few words', 'MAT.6.7', 'Length is not what makes a prayer heard.', { question: 'What does the verse warn against?', choices: ['Vain repetitions', 'Silence', 'Morning'], answer: 0 }),
    ],
  },
  {
    id: 'life-of-jesus',
    title: 'Life of Jesus',
    summary: 'Seven short readings from John and Matthew.',
    premium: true,
    lessons: [
      lesson('word', 'The Word', 'JHN.1.1', 'The reading starts with someone who was already there.', { question: 'Where does John begin?', choices: ['With a census', 'With the Word', 'With a storm'], answer: 1 }),
      lesson('light', 'Light', 'JHN.1.5', 'Light and darkness are set next to each other.', { question: 'What has not overcome the light?', choices: ['The darkness', 'The crowd', 'The temple'], answer: 0 }),
      lesson('anew', 'Born anew', 'JHN.3.3', 'Nicodemus comes with a question at night.', { question: 'What does Jesus say a person must be?', choices: ['Famous', 'Born anew', 'A priest'], answer: 1 }),
      lesson('loved', 'Loved', 'JHN.3.16', 'The verse is about love, not about earning a place.', { question: 'Who does the verse say God loved?', choices: ['The world', 'One city', 'The rulers only'], answer: 0 }),
      lesson('pray', 'A quiet room', 'MAT.6.6', 'Prayer is pictured behind a shut door.', { question: 'Where does this verse say to pray?', choices: ['On a stage', 'In your inner room', 'In the market'], answer: 1 }),
      lesson('words', 'The prayer', 'MAT.6.11', 'The ask is for today, not for a storehouse.', { question: 'What kind of bread is asked for?', choices: ['Daily bread', 'Festival bread', 'Leftovers'], answer: 0 }),
      lesson('tomorrow', 'Tomorrow', 'MAT.6.34', 'The reading leaves tomorrow until tomorrow.', { question: 'What does the verse say about tomorrow?', choices: ['Plan every hour', 'Don’t be anxious for it', 'Ignore today'], answer: 1 }),
    ],
  },
  {
    id: 'psalms-for-peace',
    title: 'Psalms for peace',
    summary: 'Seven short stops in Psalm 23 and Psalm 121.',
    premium: true,
    lessons: [
      lesson('shepherd', 'Shepherd', 'PSA.23.1', 'The speaker says they lack nothing.', { question: 'Who is the shepherd?', choices: ['A king in town', 'The LORD', 'A hired hand'], answer: 1 }),
      lesson('waters', 'Still waters', 'PSA.23.2', 'Rest is a place, not a prize.', { question: 'Where is the speaker led?', choices: ['Beside still waters', 'Into a city', 'Up a wall'], answer: 0 }),
      lesson('valley', 'The valley', 'PSA.23.4', 'The valley is named, and so is company.', { question: 'What will the speaker not fear?', choices: ['Evil', 'Sleep', 'Rain'], answer: 0 }),
      lesson('table', 'A table', 'PSA.23.5', 'There is a meal even with trouble nearby.', { question: 'What runs over?', choices: ['The cup', 'The river', 'The oil jar'], answer: 0 }),
      lesson('help', 'Where help comes from', 'PSA.121.2', 'Help is not located in the hills themselves.', { question: 'Where does help come from?', choices: ['The hills', 'The LORD', 'The army'], answer: 1 }),
      lesson('keeper', 'The keeper', 'PSA.121.3', 'The picture is of someone who does not slumber.', { question: 'What will not be allowed to move?', choices: ['Your foot', 'The sun', 'The city'], answer: 0 }),
      lesson('coming', 'Going out', 'PSA.121.8', 'The blessing covers leaving and returning.', { question: 'What does the LORD keep?', choices: ['Your going out and coming in', 'Only the morning', 'Only the harvest'], answer: 0 }),
    ],
  },
]

export function programmeById(id: string): Programme | undefined {
  return PROGRAMMES.find((item) => item.id === id)
}

export function lessonProgress(done: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((Math.min(done, total) / total) * 100)
}

export function quizCorrect(quiz: Quiz, choice: number): boolean {
  return choice === quiz.answer
}

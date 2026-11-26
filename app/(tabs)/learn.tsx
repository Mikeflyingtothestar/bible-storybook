import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { useAuth } from '@/src/auth/AuthProvider'
import { AppBar, Card, Column, Screen, Txt } from '@/src/components/ui'
import { saveLesson } from '@/src/data/wellness'
import { PROGRAMMES, lessonProgress, quizCorrect, type Programme } from '@/src/learn/programmes'
import { useAppTheme } from '@/src/theme/ThemeProvider'

export default function LearnScreen() {
  const { colors } = useAppTheme()
  const { user } = useAuth()
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [note, setNote] = useState<string | null>(null)
  return (
    <Screen testID="learn">
      <AppBar title="Learn" />
      <Column width={760} style={{ gap: 16 }}>
        <Txt size={32} weight={700} serif>
          Short tracks
        </Txt>
        <Txt color={colors.muted}>Lessons take a few minutes. Premium marks the longer track. It still opens.</Txt>
        {PROGRAMMES.map((programme) => (
          <ProgrammeCard
            key={programme.id}
            programme={programme}
            done={done}
            onAnswer={async (lessonId, correct) => {
              setDone((current) => ({ ...current, [`${programme.id}:${lessonId}`]: true }))
              setNote(correct ? 'That’s the line in the text.' : 'Look again at the verse, then try the next one.')
              if (user) await saveLesson(user.id, programme.id, lessonId, correct)
            }}
          />
        ))}
        {note ? <Txt>{note}</Txt> : null}
      </Column>
    </Screen>
  )
}

function ProgrammeCard({
  programme,
  done,
  onAnswer,
}: {
  programme: Programme
  done: Record<string, boolean>
  onAnswer: (lessonId: string, correct: boolean) => void
}) {
  const { colors } = useAppTheme()
  const finished = programme.lessons.filter((lesson) => done[`${programme.id}:${lesson.id}`]).length
  const [open, setOpen] = useState(programme.lessons[0]?.id ?? '')
  const lesson = programme.lessons.find((item) => item.id === open) ?? programme.lessons[0]
  return (
    <Card>
      <Txt size={22} weight={700}>
        {programme.title}
        {programme.premium ? ' · Premium' : ''}
      </Txt>
      <Txt color={colors.muted}>{programme.summary}</Txt>
      <Txt weight={700}>{lessonProgress(finished, programme.lessons.length)}% complete</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {programme.lessons.map((item, index) => (
          <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={item.title} onPress={() => setOpen(item.id)} style={{ minHeight: 44, paddingHorizontal: 10, borderRadius: 999, justifyContent: 'center', backgroundColor: open === item.id ? colors.accent : colors.bg }}>
            <Txt weight={700} color={open === item.id ? colors.onAccent : colors.text}>
              {index + 1}
            </Txt>
          </Pressable>
        ))}
      </View>
      {lesson ? (
        <View style={{ gap: 8 }}>
          <Txt weight={700}>
            {lesson.title} · {lesson.minutes} min
          </Txt>
          <Txt>{lesson.body}</Txt>
          <Txt color={colors.muted}>
            {lesson.verse.label}: {lesson.verse.text}
          </Txt>
          <Txt weight={700}>{lesson.quiz.question}</Txt>
          {lesson.quiz.choices.map((choice, index) => (
            <Pressable key={choice} accessibilityRole="button" onPress={() => onAnswer(lesson.id, quizCorrect(lesson.quiz, index))} style={{ minHeight: 44, justifyContent: 'center' }}>
              <Txt color={colors.accent}>{choice}</Txt>
            </Pressable>
          ))}
        </View>
      ) : null}
    </Card>
  )
}

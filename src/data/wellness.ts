import { supabase } from '../lib/supabase'
import { isWaitlistPlan } from '../pricing/plans'
import { isTopic } from '../wellness/topics'
import { mapDataError, type DataError } from './errors'

type Result<T> = { data: T | null; error: DataError | null }

function fail(error: { code?: string; message?: string } | null): DataError {
  return mapDataError(error) ?? { code: 'unavailable', message: 'Could not save just now.' }
}

export async function saveJournal(userId: string, body: string): Promise<Result<{ id: string }>> {
  const text = body.trim()
  if (text.length < 1 || text.length > 4000) return { data: null, error: { code: 'validation', message: 'Write between 1 and 4000 characters.' } }
  const { data, error } = await supabase.from('journal_entries').insert({ user_id: userId, body: text }).select('id').single()
  if (error || !data) return { data: null, error: fail(error) }
  return { data: data as { id: string }, error: null }
}

export async function saveGratitude(userId: string, body: string, localDate: string): Promise<Result<{ id: string }>> {
  const text = body.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate)) return { data: null, error: { code: 'validation', message: 'The date is not valid.' } }
  if (text.length < 1 || text.length > 500) return { data: null, error: { code: 'validation', message: 'Keep gratitude under 500 characters.' } }
  const { data, error } = await supabase
    .from('gratitude_entries')
    .upsert({ user_id: userId, body: text, local_date: localDate }, { onConflict: 'user_id,local_date' })
    .select('id')
    .single()
  if (error || !data) return { data: null, error: fail(error) }
  return { data: data as { id: string }, error: null }
}

export async function listGratitudeDates(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from('gratitude_entries').select('local_date').eq('user_id', userId).order('local_date', { ascending: false }).limit(400)
  if (error || !data) return []
  return (data as { local_date: string }[]).map((row) => row.local_date)
}

export async function saveTopics(userId: string, topics: string[]): Promise<DataError | null> {
  const clean = topics.filter(isTopic)
  const { error: removeError } = await supabase.from('user_topics').delete().eq('user_id', userId)
  if (removeError) return fail(removeError)
  if (clean.length === 0) return null
  const { error } = await supabase.from('user_topics').insert(clean.map((topic) => ({ user_id: userId, topic })))
  return error ? fail(error) : null
}

export async function joinWaitlist(userId: string, plan: string): Promise<DataError | null> {
  if (!isWaitlistPlan(plan)) return { code: 'validation', message: 'That plan is not on the waitlist.' }
  const { error } = await supabase.from('waitlist_signups').insert({ user_id: userId, plan })
  if (error?.code === '23505') return null
  return error ? fail(error) : null
}

export async function saveLesson(userId: string, programmeId: string, lessonId: string, correct: boolean): Promise<DataError | null> {
  if (programmeId.length < 1 || programmeId.length > 40 || lessonId.length < 1 || lessonId.length > 40) {
    return { code: 'validation', message: 'That lesson is not recognised.' }
  }
  const { error } = await supabase.from('lesson_progress').upsert(
    { user_id: userId, programme_id: programmeId, lesson_id: lessonId, completed: true, quiz_score: correct ? 100 : 0 },
    { onConflict: 'user_id,programme_id,lesson_id' },
  )
  return error ? fail(error) : null
}

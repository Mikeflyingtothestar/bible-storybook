import { useEffect, useRef } from 'react'
import { AppState, Platform } from 'react-native'

import { useAuth } from '../auth/AuthProvider'
import { supabase } from '../lib/supabase'
import { addActiveSeconds, isActivelyReading, localDateISO } from './activeTime'

type Mode = 'text' | 'audio' | 'bedtime'

/**
 * Logs active seconds for a signed-in reader. Hidden tabs and a minute of stillness do not count.
 */
export function useReadingSession(options: { chapterId: number | null; mode: Mode; completed: boolean; enabled?: boolean }) {
  const { user } = useAuth()
  const optionsRef = useRef(options)
  const secondsRef = useRef(0)
  const idRef = useRef<string | null>(null)
  const lastTick = useRef(0)
  const lastActivity = useRef(0)

  useEffect(() => {
    optionsRef.current = options
  })

  useEffect(() => {
    if (!user || options.enabled === false) return
    const started = Date.now()
    lastTick.current = started
    lastActivity.current = started
    let stopped = false
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    const localDate = localDateISO(new Date(), timeZone)

    void supabase
      .from('reading_sessions')
      .insert({
        user_id: user.id,
        chapter_id: options.chapterId,
        mode: options.mode,
        seconds_active: 0,
        completed: false,
        local_date: localDate,
      })
      .select('id')
      .single()
      .then(({ data }) => {
        if (!stopped && data) idRef.current = (data as { id: string }).id
      })

    const mark = () => {
      lastActivity.current = Date.now()
    }
    const visible = () => {
      if (Platform.OS === 'web' && typeof document !== 'undefined') return document.visibilityState === 'visible'
      return AppState.currentState === 'active'
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('pointerdown', mark)
      window.addEventListener('keydown', mark)
      window.addEventListener('scroll', mark, true)
    }
    const appSub = AppState.addEventListener('change', mark)

    const timer = setInterval(() => {
      const now = Date.now()
      const elapsed = now - lastTick.current
      lastTick.current = now
      const active = isActivelyReading(visible(), now - lastActivity.current)
      secondsRef.current = addActiveSeconds(secondsRef.current, elapsed, active)
    }, 1000)

    const flush = async (completed: boolean) => {
      if (!idRef.current) return
      await supabase
        .from('reading_sessions')
        .update({ seconds_active: secondsRef.current, completed })
        .eq('id', idRef.current)
      if (secondsRef.current > 0) {
        await supabase.rpc('recompute_my_progress', { tz: timeZone })
      }
    }
    const flushTimer = setInterval(() => {
      void flush(optionsRef.current.completed)
    }, 15000)

    return () => {
      stopped = true
      clearInterval(timer)
      clearInterval(flushTimer)
      appSub.remove()
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.removeEventListener('pointerdown', mark)
        window.removeEventListener('keydown', mark)
        window.removeEventListener('scroll', mark, true)
      }
      void flush(optionsRef.current.completed)
    }
    // A new chapter or mode starts a new session. Completion is read from the ref at flush time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, options.chapterId, options.mode, options.enabled])
}

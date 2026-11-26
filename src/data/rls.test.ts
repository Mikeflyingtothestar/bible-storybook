import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const dir = join(process.cwd(), 'supabase/migrations')
const sql = readdirSync(dir)
  .filter((name) => name.endsWith('.sql'))
  .map((name) => readFileSync(join(dir, name), 'utf8'))
  .join('\n')

function tables(): string[] {
  return [...sql.matchAll(/create table (?:if not exists )?public\.([a-z_]+)/g)].map((match) => match[1] ?? '')
}

function rlsTables(): Set<string> {
  const named = [...sql.matchAll(/alter table public\.([a-z_]+) enable row level security/g)].map((match) => match[1] ?? '')
  const loop = [...sql.matchAll(/array\s*\[([\s\S]*?)\]/g)].flatMap((match) => [...(match[1] ?? '').matchAll(/'([a-z_]+)'/g)].map((item) => item[1] ?? ''))
  return new Set([...named, ...loop])
}

describe('row level security', () => {
  it('enables RLS on every public table', () => {
    const covered = rlsTables()
    for (const table of tables()) {
      expect(covered.has(table), table).toBe(true)
    }
  })

  it('gives owner-only access on the wellness tables', () => {
    for (const table of ['journal_entries', 'gratitude_entries', 'mood_checkins', 'waitlist_signups', 'companion_messages', 'user_topics', 'prayer_reminders', 'lesson_progress']) {
      expect(sql).toContain(`on public.${table} for all to authenticated`)
      expect(sql).toContain(`user_id = (select auth.uid())`)
      expect(sql).toContain(`revoke all on table public.${table} from anon`)
    }
  })
})

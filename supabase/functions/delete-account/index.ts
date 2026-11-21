// Deploy later with the Supabase CLI. Do not put the service-role key in the repo.
// The hosted function receives SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY as secrets.
import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization, content-type',
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  const url = Deno.env.get('SUPABASE_URL')
  const anon = Deno.env.get('SUPABASE_ANON_KEY')
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const header = request.headers.get('Authorization')
  if (!url || !anon || !service || !header) return json({ error: 'unauthorized' }, 401)

  const userClient = createClient(url, anon, { global: { headers: { Authorization: header } } })
  const { data, error } = await userClient.auth.getUser()
  if (error || !data.user) return json({ error: 'unauthorized' }, 401)

  const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } })
  const removed = await admin.auth.admin.deleteUser(data.user.id)
  if (removed.error) return json({ error: 'could not delete account' }, 500)
  return json({ ok: true }, 200)
})

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json' } })
}

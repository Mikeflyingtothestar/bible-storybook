// Parent-created child profile. Phase 2. Requires an explicit consent timestamp from the caller.
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('method not allowed', { status: 405 })
  const body = (await request.json().catch(() => null)) as { consent?: boolean; displayName?: string; birthYear?: number } | null
  if (!body?.consent) return Response.json({ error: 'A parent must confirm consent before a child profile can be created.' }, { status: 400 })

  const url = Deno.env.get('SUPABASE_URL')
  const anon = Deno.env.get('SUPABASE_ANON_KEY')
  const header = request.headers.get('Authorization')
  if (!url || !anon || !header) return Response.json({ error: 'unauthorized' }, { status: 401 })
  const client = createClient(url, anon, { global: { headers: { Authorization: header } } })
  const { data } = await client.auth.getUser()
  if (!data.user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  return Response.json(
    {
      error: 'Child profiles are not available in this phase. Consent was checked and no account was created.',
      consentAt: new Date().toISOString(),
      parentId: data.user.id,
    },
    { status: 501 },
  )
})

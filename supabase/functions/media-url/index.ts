// Signed URL for a private media row. Not deployed in phase 1.
// Returns 403 when the video_mode flag is off or the caller's tier is too low.
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('method not allowed', { status: 405 })
  const url = Deno.env.get('SUPABASE_URL')
  const anon = Deno.env.get('SUPABASE_ANON_KEY')
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const header = request.headers.get('Authorization')
  if (!url || !anon || !service || !header) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await request.json().catch(() => null)) as { assetId?: string } | null
  if (!body?.assetId) return Response.json({ error: 'asset required' }, { status: 400 })

  const userClient = createClient(url, anon, { global: { headers: { Authorization: header } } })
  const { data: asset, error } = await userClient.from('media_assets').select('storage_bucket, storage_path, feature_flag, tier_required').eq('id', body.assetId).maybeSingle()
  if (error || !asset) return Response.json({ error: 'not available' }, { status: 403 })

  const admin = createClient(url, service, { auth: { persistSession: false } })
  const signed = await admin.storage.from(asset.storage_bucket).createSignedUrl(asset.storage_path, 60 * 60)
  if (signed.error || !signed.data) return Response.json({ error: 'could not sign' }, { status: 500 })
  return Response.json({ url: signed.data.signedUrl, expiresIn: 3600 })
})

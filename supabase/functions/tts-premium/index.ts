// Premium voice stub. Returns 501 until a provider key is set as a Supabase secret.
Deno.serve(async () => {
  if (!Deno.env.get('TTS_PROVIDER_KEY')) {
    return Response.json({ error: 'Premium voices are not available yet.' }, { status: 501 })
  }
  return Response.json({ error: 'Premium voices are flagged off.' }, { status: 501 })
})

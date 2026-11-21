// Billing webhook stub. While the billing flag is off this stores nothing and returns 200.
Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('method not allowed', { status: 405 })
  const configured = Boolean(Deno.env.get('BILLING_WEBHOOK_SECRET'))
  if (!configured) return Response.json({ ok: true, billing: false, stored: false })
  return Response.json({ ok: true, billing: false, note: 'Signature check is ready once purchases are enabled. No tier was changed.' })
})

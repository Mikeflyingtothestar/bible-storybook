export const PLANS = [
  { id: 'free', name: 'Free', price: 'Basic content', detail: 'Today’s verse, a short teaching, one prayer, and a short journal.', comingSoon: false },
  { id: 'premium-monthly', name: 'Premium', price: 'US$5.99/month', detail: 'The fuller library, sleep catalog, and unlimited companion. Still usable while billing is off.', comingSoon: true },
  { id: 'premium-annual', name: 'Premium Annual', price: 'US$39.99/year', detail: 'The same Premium set, billed once a year when payments exist.', comingSoon: true },
  { id: 'family', name: 'Family', price: 'US$9.99/month', detail: 'A shared plan for the household. Profiles are groundwork for now.', comingSoon: true },
] as const

export type PlanId = (typeof PLANS)[number]['id']

export function isWaitlistPlan(id: string): id is Exclude<PlanId, 'free'> {
  return id === 'premium-monthly' || id === 'premium-annual' || id === 'family'
}

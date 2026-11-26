export const PLANS = [
  { id: 'premium-monthly', name: 'Monthly', price: 'US$5.99/month', detail: 'Individual plan. Fuller library, sleep catalog, and more companion questions when billing exists.', comingSoon: true, best: false, points: ['Daily verse and teaching', 'Morning and night prayer', 'Short journal'] },
  { id: 'premium-annual', name: 'Annual', price: 'US$39.99/year', detail: 'Best value. The same individual plan, paid once a year.', comingSoon: true, best: true, points: ['Everything monthly includes', 'Sleep stories', 'More companion questions'] },
  { id: 'family', name: 'Family', price: 'US$9.99/month', detail: 'After an individual plan. Each person keeps their own profile.', comingSoon: true, best: false, points: ['Individual plans come first', 'Separate profiles', 'Not a weekly charge'] },
] as const

export type PlanId = (typeof PLANS)[number]['id']

export function isWaitlistPlan(id: string): id is Exclude<PlanId, 'free'> {
  return id === 'premium-monthly' || id === 'premium-annual' || id === 'family'
}

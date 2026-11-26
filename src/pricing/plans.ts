export const PLANS = [
  { id: 'premium-monthly', name: 'Monthly', price: 'US$5.99/month', detail: 'For one person who wants the fuller library and a longer night.', comingSoon: true, best: false, points: ['Every sleep story', 'More companion questions', 'The full reading library'] },
  { id: 'premium-annual', name: 'Annual', price: 'US$39.99/year', detail: 'A year of quiet mornings, for less than paying month by month.', comingSoon: true, best: true, points: ['Everything in Monthly', 'Two months included', 'One renewal a year'] },
  { id: 'family', name: 'Family', price: 'US$9.99/month', detail: 'One home, separate profiles, so each person keeps their own streak.', comingSoon: true, best: false, points: ['Up to six profiles', 'Shared evening reminder', 'Each journal stays private'] },
] as const

export type PlanId = (typeof PLANS)[number]['id']

export function isWaitlistPlan(id: string): id is Exclude<PlanId, 'free'> {
  return id === 'premium-monthly' || id === 'premium-annual' || id === 'family'
}

export function isWaitlistEmail(value: string): boolean {
  const email = value.trim()
  return email.length >= 6 && email.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

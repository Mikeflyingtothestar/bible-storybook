import { expect, test } from '@playwright/test'

const DIRECT = [
  ['/pricing', 'Plans launching soon'],
  ['/onboarding', 'What would help this week?'],
  ['/home', /Good morning|Good evening/],
  ['/sign-up', 'Create your account'],
  ['/bible/GEN/1', /In the beginning/],
  ['/bible/JHN/3', 'John 3'],
  ['/privacy', 'Privacy'],
  ['/bedtime/play/psalm-23', 'Psalm 23'],
] as const

test('direct loads of key routes return the screen', async ({ page }) => {
  test.setTimeout(120_000)
  for (const [route, text] of DIRECT) {
    const response = await page.goto(`/bible-storybook${route}`)
    expect(response?.status(), route).toBe(200)
    await expect(page.getByText(text).first()).toBeVisible()
  }

  const response = await page.goto('/bible-storybook/')
  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle('Bible Storybook — a few quiet minutes')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /quiet minutes/)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /quiet minutes/)
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /No weekly billing/)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\.webp$/)
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', /manifest\.webmanifest$/)
  await expect(page.locator('link[rel="icon"], link[rel="shortcut icon"]').first()).toHaveCount(1)
})

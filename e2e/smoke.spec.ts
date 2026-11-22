import { expect, test } from '@playwright/test'

test('landing, sign-up, reader, bookmark, theme, and bedtime timer', async ({ page }) => {
  await page.goto('/bible-storybook/')
  await expect(page.getByText('The Bible, told like a story')).toBeVisible()
  await page.getByTestId('sign-up-link').click()
  await expect(page.getByTestId('email')).toBeVisible()
  await expect(page.getByTestId('password')).toBeVisible()

  await page.goto('/bible-storybook/bible/GEN/1')
  await expect(page.getByText(/In the beginning, God created/)).toBeVisible()
  await page.getByTestId('verse-1').click()
  await page.getByTestId('bookmark-verse').click()
  await expect(page.getByText('Sign in to save this verse.')).toBeVisible()
  await page.getByText('Close').click()
  await page.getByTestId('theme-dark').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await page.clock.install()
  await page.goto('/bible-storybook/bedtime/play/creation')
  await page.getByTestId('timer-5').click()
  await page.getByTestId('bedtime-start').click()
  await expect(page.getByTestId('speaking-state')).toHaveText('Reading aloud')
  await page.clock.fastForward(5 * 60 * 1000 + 1500)
  await expect(page.getByText('Time to rest. The reading has faded out.')).toBeVisible()
  await expect(page.getByTestId('speaking-state')).toHaveText('Faded out')
})

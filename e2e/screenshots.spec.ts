import { expect, test } from '@playwright/test'

const out = '/opt/cursor/artifacts'

test('capture light and dark screens', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`/bible-storybook/?theme=${theme}`)
    await expect(page.getByText('The Bible, told like a story')).toBeVisible()
    await page.screenshot({ path: `${out}/landing-${theme}.png` })

    await page.goto('/bible-storybook/sign-in')
    await expect(page.getByTestId('email')).toBeVisible()
    await page.screenshot({ path: `${out}/sign-in-${theme}.png` })

    await page.goto('/bible-storybook/bible/GEN/1')
    await expect(page.getByText(/In the beginning, God created/)).toBeVisible()
    await page.screenshot({ path: `${out}/reader-${theme}.png` })

    await page.goto('/bible-storybook/me')
    await expect(page.getByTestId('dashboard')).toBeVisible()
    await page.screenshot({ path: `${out}/dashboard-${theme}.png` })
  }

  await page.goto('/bible-storybook/bedtime')
  await expect(page.getByText('Psalm 23')).toBeVisible()
  await page.screenshot({ path: `${out}/bedtime-picker.png` })
  await page.goto('/bible-storybook/bedtime/play/psalm-23')
  await expect(page.getByText(/The LORD is my shepherd/)).toBeVisible()
  await page.screenshot({ path: `${out}/bedtime-player.png` })
})

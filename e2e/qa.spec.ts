import { expect, test, type Page } from '@playwright/test'

const LIVE = (process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173/bible-storybook').replace(/\/?$/, '/')

function track(page: Page, bucket: string[]) {
  page.on('pageerror', (error) => bucket.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') bucket.push(`console: ${message.text()}`)
  })
}

test.describe('qa', () => {
  test.use({ baseURL: LIVE })

  test('desktop flows', async ({ page }) => {
    test.setTimeout(180_000)
    const errors: string[] = []
    track(page, errors)
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto('./')
    await expect(page.getByText('Calm, sleep, and a moment to reflect')).toBeVisible()
    await expect(page.locator('link[rel="icon"], link[rel="shortcut icon"]').first()).toHaveCount(1)
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description, 'missing description').toBeTruthy()
    const og = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(og, 'missing og:title').toBeTruthy()

    await page.getByRole('link', { name: 'Open the reader' }).or(page.getByTestId('open-reader')).first().click()
    await expect(page.getByRole('link', { name: 'Genesis' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Revelation' })).toBeVisible()

    await page.getByRole('button', { name: 'King James Version' }).click()
    await page.getByRole('link', { name: 'John', exact: true }).click()
    await page.getByRole('link', { name: 'John 1', exact: true }).click()
    await expect(page.getByText(/was made flesh/)).toBeVisible({ timeout: 20_000 })

    await page.getByTestId('next-chapter').last().click()
    await expect(page.getByText('John 2').first()).toBeVisible()
    await expect(page.getByLabel(/Verse 1\. And the third day/)).toBeVisible({ timeout: 20_000 })
    await page.getByTestId('prev-chapter').last().click()
    await expect(page.getByRole('button', { name: /Verse 1\. In the beginning was the Word/ })).toBeVisible({ timeout: 20_000 })

    await page.goto('bible')
    await page.getByRole('button', { name: 'Berean Standard Bible' }).click()
    await page.getByRole('link', { name: 'John', exact: true }).click()
    await page.getByRole('link', { name: 'John 1', exact: true }).click()
    await expect(page.getByText(/made His dwelling among us/)).toBeVisible({ timeout: 20_000 })

    await page.goto('bible')
    await page.getByRole('button', { name: 'World English Bible' }).click()
    await page.getByTestId('open-search').click()
    await page.getByTestId('search-input').fill('shepherd')
    await page.getByTestId('search-submit').click()
    await expect(page.getByText(/Psalm 23:1|Psalms 23:1/).first()).toBeVisible({ timeout: 20_000 })

    await page.goto('bible/PSA/23')
    await expect(page.getByText(/shepherd/i)).toBeVisible({ timeout: 20_000 })
    await page.getByTestId('verse-1').last().click()
    await page.getByTestId('bookmark-verse').click()
    await expect(page.getByText('Sign in to save this verse.')).toBeVisible()
    await page.getByText('Close').click()

    await page.getByTestId('listen-toggle').last().click()
    await expect(page.getByTestId('listen-toggle').last()).toHaveText('Stop')
    await page.getByTestId('listen-toggle').last().click()
    await expect(page.getByTestId('listen-toggle').last()).toHaveText('Listen')

    await page.getByRole('link', { name: 'More' }).or(page.getByRole('tab', { name: 'More' })).first().click()
    await page.getByRole('link', { name: 'Stories' }).click()
    await expect(page.getByRole('link', { name: 'Creation' })).toBeVisible()
    await page.getByRole('link', { name: 'Creation' }).click()
    await expect(page.getByText('A beginning')).toBeVisible()
    await expect(page.getByText(/God created the heavens/)).toBeVisible()

    await page.goto('bedtime/play/psalm-23')
    await page.getByTestId('timer-5').click()
    await expect(page.getByTestId('timer-label')).toHaveText('5 minutes')
    await page.getByTestId('bedtime-start').click()
    await expect(page.getByTestId('speaking-state')).toHaveText('Reading aloud')
    await page.getByTestId('bedtime-stop').click()
    await expect(page.getByTestId('speaking-state')).toHaveText('Ready')

    await page.goto('me')
    await expect(page.getByTestId('dashboard')).toBeVisible()
    await expect(page.getByTestId('dashboard').getByText('Faith Journey')).toBeVisible()
    await page.getByRole('link', { name: 'Settings' }).click()
    await expect(page.getByText('Text size')).toBeVisible()
    await page.getByTestId('theme-dark').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.getByTestId('theme-light').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.goto('bible/JHN/3')
    await expect(page.getByTestId('verse-16').last()).toBeVisible({ timeout: 20_000 })
    await page.reload()
    await expect(page.getByTestId('verse-16').last()).toBeVisible({ timeout: 20_000 })
    await expect(page).toHaveURL(/\/bible\/JHN\/3/)

    const unexpected = errors.filter((line) => !/favicon|net::ERR_BLOCKED_BY_CLIENT|Download the React DevTools/.test(line))
    expect(unexpected, unexpected.join('\n')).toEqual([])
  })

  test('mobile viewport', async ({ page }) => {
    test.setTimeout(90_000)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('./')
    await expect(page.getByText('Calm, sleep, and a moment to reflect')).toBeVisible()
    await page.goto('bible/GEN/1')
    await expect(page.getByLabel(/Verse 1\. In the beginning, God created/)).toBeVisible({ timeout: 20_000 })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 8)
    expect(overflow).toBe(false)
  })

  test('today, ask, pray, sleep, journal, learn, and pricing', async ({ page }) => {
    test.setTimeout(90_000)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('home')
    await expect(page.getByText(/day streak|gentle start/i).first()).toBeVisible()
    await page.getByRole('tab', { name: 'Ask' }).click()
    await expect(page.getByText('What is on your mind?')).toBeVisible()
    await page.getByRole('tab', { name: 'Pray' }).click()
    await expect(page.getByText('Morning and night')).toBeVisible()
    await page.getByRole('tab', { name: 'Journal' }).click()
    await expect(page.getByRole('heading', { name: 'A private page' }).or(page.getByText('A private page'))).toBeVisible()
    await page.goto('learn')
    await expect(page.getByText('Short tracks')).toBeVisible()
    await page.goto('bedtime')
    await expect(page.getByRole('button', { name: 'Psalm 23' })).toBeVisible()
    await page.goto('paywall')
    await expect(page.getByText('Cancel anytime, no weekly billing')).toBeVisible()
    await page.route('**/rest/v1/plan_waitlist**', (route) => route.fulfill({ status: 201, contentType: 'application/json', body: '[]' }))
    await page.getByRole('textbox', { name: 'Email' }).fill('reader@example.com')
    await page.getByTestId('upgrade').click()
    await expect(page.getByTestId('waitlist-success')).toBeVisible()
  })
})

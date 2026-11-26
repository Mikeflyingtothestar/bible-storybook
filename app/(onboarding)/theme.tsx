import { OnboardingStep } from '@/src/components/OnboardingStep'
import { ThemeSwitcher } from '@/src/components/ui'

export default function ChooseTheme() {
  return (
    <OnboardingStep step="2 of 5" title="How should the page look?" body="System follows the device. Sepia is the warm paper tone." next="/goal">
      <ThemeSwitcher />
    </OnboardingStep>
  )
}

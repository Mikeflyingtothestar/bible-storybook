import { Link } from 'expo-router'

import { Button, Column, Screen, Txt } from '@/src/components/ui'

export default function NotFound() {
  return (
    <Screen>
      <Column width={560} style={{ paddingTop: 80, gap: 16 }}>
        <Txt size={32} weight={800} serif>
          This page has wandered off.
        </Txt>
        <Txt color="#6B7080">The reading you wanted isn’t at this address.</Txt>
        <Link href="/" asChild>
          <Button label="Back to the beginning" />
        </Link>
      </Column>
    </Screen>
  )
}

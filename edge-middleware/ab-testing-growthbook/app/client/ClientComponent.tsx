'use client'
import { List, Text, Link } from '@vercel/examples-ui'
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react'

export default function ClientComponent() {
  const feature1Enabled = useFeatureIsOn('feature1')
  const feature2Value = useFeatureValue('feature2', 'fallback')
  return (
    <section className="flex flex-col gap-3">
      <Text variant="h2">Client Rendering (Unoptimized)</Text>
      <Text>
        This component renders entirely client-side. The page initially
        delivered to the client will not have feature definitions loaded, and a
        network request will be required. This can result in a
        &apos;flicker&apos; where fallback values are rendered first and then
        swapped in with their real values later.
      </Text>
      <Text>
        To avoid this flicker, check out the{' '}
        <Link href="/client-optimized">Optimized Client</Link> example.
      </Text>
      <List variant="ul">
        <li>
          feature1: <strong>{feature1Enabled ? 'ON' : 'OFF'}</strong>
        </li>
        <li>
          feature2: <strong>{feature2Value}</strong>
        </li>
      </List>
    </section>
  )
}

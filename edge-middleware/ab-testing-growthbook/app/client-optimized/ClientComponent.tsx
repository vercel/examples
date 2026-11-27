'use client'
import RevalidateMessage from '../revalidate/RevalidateMessage'
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react'
import { Text, List } from '@vercel/examples-ui'

export default function ClientComponent() {
  const feature1Enabled = useFeatureIsOn('feature1')
  const feature2Value = useFeatureValue('feature2', 'fallback')
  return (
    <section className="flex flex-col gap-3">
      <Text variant="h2">Optimized Client Rendering</Text>
      <Text>
        This page fetches feature flags and experiments at build time, but waits
        to evaluate them until client-side rendering. This gives you flexibility
        while avoiding flicker.
      </Text>
      <List variant="ul">
        <li>
          feature1: <strong>{feature1Enabled ? 'ON' : 'OFF'}</strong>
        </li>
        <li>
          feature2: <strong>{feature2Value}</strong>
        </li>
      </List>

      <RevalidateMessage />
    </section>
  )
}

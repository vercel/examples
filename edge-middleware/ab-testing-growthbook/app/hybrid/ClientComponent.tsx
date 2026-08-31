'use client'
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react'
import { List, Text } from '@vercel/examples-ui'

export default function ClientComponent() {
  const feature1Enabled = useFeatureIsOn('feature1')
  const feature2Value = useFeatureValue('feature2', 'fallback')
  return (
    <section className="flex flex-col gap-3">
      <Text>And these features are rendered client-side:</Text>
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

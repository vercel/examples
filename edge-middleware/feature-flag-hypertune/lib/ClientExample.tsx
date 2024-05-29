'use client'

import { Text } from '@vercel/examples-ui'
import { useHypertune } from '../generated/hypertune.react'

export default function ClientExample(): React.ReactElement {
  const hypertune = useHypertune()

  const exampleFlag = hypertune.exampleFlag({ fallback: false })

  return (
    <Text>
      React Client Component (RCC) flag: <strong>{String(exampleFlag)}</strong>
    </Text>
  )
}

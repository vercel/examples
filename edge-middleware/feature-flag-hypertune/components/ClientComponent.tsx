'use client'

import { Text } from '@vercel/examples-ui'
import { useHypertune } from '../generated/hypertune.react'

export default function ClientComponent(): React.ReactElement {
  const hypertune = useHypertune()

  const exampleFlag = hypertune.exampleFlag({ fallback: false })

  return (
    <Text>
      (Client Component) Example Flag: <strong>{String(exampleFlag)}</strong>
    </Text>
  )
}

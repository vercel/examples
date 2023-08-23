'use client'
import { Text } from '@vercel/examples-ui'

import useHypertune from './useHypertune'

export default function ClientExample() {
  const rootNode = useHypertune()
  const exampleFlag = rootNode.exampleFlag().get(false)
  console.log('Client-side feature flag:', exampleFlag)
  return (
    <Text>
      Client-side feature flag: <strong>{String(exampleFlag)}</strong>
    </Text>
  )
}

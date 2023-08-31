'use client'
import { Text } from '@vercel/examples-ui'

import useHypertune from './useHypertune'
import { InitResponseBody } from 'hypertune'

export default function ClientExample({
  hypertuneInitData,
}: {
  hypertuneInitData: InitResponseBody
}) {
  const rootNode = useHypertune()
  rootNode.initFromData(hypertuneInitData)

  const exampleFlag = rootNode.exampleFlag().get(false)
  console.log('Client-side feature flag:', exampleFlag)

  return (
    <Text>
      Client-side feature flag: <strong>{String(exampleFlag)}</strong>
    </Text>
  )
}

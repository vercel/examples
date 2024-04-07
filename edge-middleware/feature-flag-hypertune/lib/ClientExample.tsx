'use client'

import { Text } from '@vercel/examples-ui'
import { DehydratedState } from 'hypertune'
import hypertune from './hypertune'
import useHypertune from './useHypertune'

export default function ClientExample({
  hypertuneDehydratedState,
}: {
  hypertuneDehydratedState?: DehydratedState | null
}): React.ReactElement {
  if (hypertuneDehydratedState) {
    hypertune.hydrate(hypertuneDehydratedState)
  }

  const rootNode = useHypertune()

  const exampleFlag = rootNode.exampleFlag().get(/* fallback */ false)

  return (
    <Text>
      React Client Component (RCC) flag: <strong>{String(exampleFlag)}</strong>
    </Text>
  )
}

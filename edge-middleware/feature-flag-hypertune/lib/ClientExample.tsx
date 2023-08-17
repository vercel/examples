'use client'

import useHypertune from './useHypertune'

export default function ClientExample() {
  const rootNode = useHypertune()
  const exampleFlag = rootNode.exampleFlag().get(false)
  console.log('Client-side feature flag:', exampleFlag)
  return (
    <div>
      Client-side feature flag: <strong>{String(exampleFlag)}</strong>
    </div>
  )
}

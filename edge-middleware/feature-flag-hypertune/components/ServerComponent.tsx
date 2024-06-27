import { Suspense } from 'react'
import { Text } from '@vercel/examples-ui'
import { VercelFlagValues } from '../generated/hypertune.vercel'
import getHypertune from '../lib/getHypertune'

export default async function ServerComponent() {
  const hypertune = await getHypertune()

  const exampleFlag = hypertune.exampleFlag({ fallback: false })

  return (
    <>
      <Text>
        (Server Component) Example Flag: <strong>{String(exampleFlag)}</strong>
      </Text>

      <Suspense fallback={null}>
        <VercelFlagValues flagValues={hypertune.get()} />
      </Suspense>
    </>
  )
}

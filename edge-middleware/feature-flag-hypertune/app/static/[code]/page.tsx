import { unstable_generatePermutations as generatePermutations } from '@vercel/flags/next'
import { exampleFlagFlag } from '../../../generated/hypertune.vercel'
import precomputeFlags from '../../../lib/precomputeFlags'

export async function generateStaticParams() {
  const codes = await generatePermutations(precomputeFlags)
  return codes.map((code) => ({ code }))
}

export default async function Page({ params }: { params: { code: string } }) {
  // access the precomputed result by passing params.code and precomputeFlags
  const exampleFlag = await exampleFlagFlag(params.code, precomputeFlags)

  return <div>Example Flag: {String(exampleFlag)}</div>
}

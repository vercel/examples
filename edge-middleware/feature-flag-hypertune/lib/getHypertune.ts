import { Query, RootNode } from '../generated/generated'
import getVercelFlagOverrides from './getVercelFlagOverrides'
import hypertune from './hypertune'

export default async function getHypertune(): Promise<RootNode> {
  await hypertune.initFromServerIfNeeded()

  const vercelFlagOverrides = await getVercelFlagOverrides()
  hypertune.setOverride<Query>({ root: vercelFlagOverrides })

  // Return the Hypertune root node initialized with the current user
  return hypertune.root({
    context: {
      user: { id: 'test_id', name: 'Test', email: 'test@test.com' },
    },
  })
}

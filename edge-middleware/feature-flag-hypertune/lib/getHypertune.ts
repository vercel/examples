import { Query, RootNode } from '../generated/hypertune'
import getVercelFlagOverrides from './getVercelFlagOverrides'
import hypertune from './hypertune'

export default async function getHypertune(): Promise<RootNode> {
  await hypertune.initIfNeeded()

  // Respect overrides set by the Vercel Toolbar
  const vercelFlagOverrides = await getVercelFlagOverrides()
  hypertune.setOverride<Query>({ root: vercelFlagOverrides })

  // Return the Hypertune root node initialized with the current user
  return hypertune.root({
    args: {
      context: {
        environment: 'DEVELOPMENT',
        user: { id: 'test_id', name: 'Test', email: 'test@test.com' },
      },
    },
  })
}

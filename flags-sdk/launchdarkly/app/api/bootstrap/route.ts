import { getStableId } from '@/utils/get-stable-id'
import { ldAdapter, type LDContext } from '@/lib/launchdarkly-adapter'
import { connection, NextResponse } from 'next/server'

export async function GET(request: Request): Promise<NextResponse> {
  // This route returns a per-user flag payload (keyed by the stable id cookie),
  // so it must run per request. Marking it dynamic also avoids initializing the
  // LaunchDarkly client at build time.
  await connection()

  await ldAdapter.ldClient.waitForInitialization()
  const stableId = await getStableId()

  const user: LDContext = {
    kind: 'user',
    key: stableId.value,
  }

  const values = (await ldAdapter.ldClient.allFlagsState(user))?.toJSON()

  return NextResponse.json(
    { user, values },
    {
      headers: {
        'Cache-Control': 'private, max-age=60',
        Vary: 'Cookie',
      },
    }
  )
}

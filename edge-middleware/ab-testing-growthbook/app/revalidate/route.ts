import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// Use a route handler to refresh all cache entries related to GrowthBook.
// GrowthBook SDK webhooks can be used to trigger this event immediately after
// making a change on the platform.
export const POST = (_req: NextRequest) => {
  // TODO assert request is authorized from GrowthBook instance
  revalidateTag('growthbook')

  return NextResponse.json({ message: 'Features revalidated' })
}

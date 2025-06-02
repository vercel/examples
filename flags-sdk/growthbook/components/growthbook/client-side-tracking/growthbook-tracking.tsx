import {
  growthbookAdapter,
  type Attributes,
  type StickyAssignmentsDocument,
} from '@flags-sdk/growthbook'
import { identify } from '@/lib/identify'
import { GrowthbookTrackingClient } from './client'

export async function GrowthbookTracking({
  featureIds,
}: {
  featureIds: string[]
}) {
  await growthbookAdapter.initialize()
  const payload = growthbookAdapter.growthbook.getDecryptedPayload()
  const attributes: Attributes = await identify()
  let stickyBucketAssignmentDocs:
    | Record<string, StickyAssignmentsDocument>
    | undefined
  if (growthbookAdapter.stickyBucketService) {
    const ctx = await growthbookAdapter.growthbook.applyStickyBuckets(
      { attributes },
      growthbookAdapter.stickyBucketService
    )
    stickyBucketAssignmentDocs = ctx.stickyBucketAssignmentDocs
  }

  return (
    <GrowthbookTrackingClient
      featureIds={featureIds}
      attributes={attributes}
      payload={payload}
      stickyBucketAssignmentDocs={stickyBucketAssignmentDocs}
    />
  )
}

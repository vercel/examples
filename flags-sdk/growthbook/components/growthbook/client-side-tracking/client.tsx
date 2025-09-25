'use client'

import {
  GrowthBookClient,
  type Attributes,
  type TrackingCallback,
  type StickyAssignmentsDocument,
  type FeatureApiResponse,
  type UserContext,
} from '@growthbook/growthbook'
import { useEffect } from 'react'

// You may also use type TrackingCallbackWithUser if your tracking library requires user context.
const trackingCallback: TrackingCallback = (experiment, result) => {
  console.log('Viewed Experiment (client-side tracking)', {
    experimentId: experiment.key,
    variationId: result.key,
  })
}

// If using TrackingCallbackWithUser, pass it into GrowthBookClient constructor instead of evalFeature.
const growthbook = new GrowthBookClient()

// Dedupe tracked experiments (evalFeature automatically mutates this)
const trackedExperiments = new Set<string>()

export function GrowthbookTrackingClient({
  featureIds,
  attributes,
  payload,
  stickyBucketAssignmentDocs,
}: {
  featureIds: string[]
  attributes: Attributes
  payload: FeatureApiResponse
  stickyBucketAssignmentDocs?: Record<string, StickyAssignmentsDocument>
}) {
  useEffect(() => {
    growthbook.initSync({ payload })
    // saveStickyBucketAssignmentDoc is a no-op because SBs are persisted server-side
    featureIds.forEach((fid) => {
      const ctx: UserContext = {
        attributes,
        stickyBucketAssignmentDocs,
        saveStickyBucketAssignmentDoc: async (
          doc: StickyAssignmentsDocument
        ) => {},
        trackingCallback,
        trackedExperiments,
      }
      growthbook.evalFeature(fid, ctx)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

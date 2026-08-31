'use client'
import { TrackingCallback, TrackingData } from '@growthbook/growthbook'
import { useEffect } from 'react'

export const onExperimentView: TrackingCallback = (experiment, result) => {
  // TODO: track with Google Analytics, Segment, etc.
  console.log('Viewed Experiment', {
    experimentId: experiment.key,
    variationId: result.key,
  })
}

// Helper component to track experiment views from server components
export function GrowthBookTracking({ data }: { data: TrackingData[] }) {
  useEffect(() => {
    data.forEach(({ experiment, result }) => {
      onExperimentView(experiment, result)
    })
  }, [data])

  return null
}

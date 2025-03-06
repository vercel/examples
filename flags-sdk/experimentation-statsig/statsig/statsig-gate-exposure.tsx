'use client'

/**
 * This file exports exposure helpers for Static/ISR pages.
 * - Wait for Statsig to initialize
 * - Log exposures when ready
 * - Add debug info outside of production
 */

import { useContext } from 'react'
import { StatsigAppBootstrapContext } from './statsig-provider'
import {
  useExperiment,
  useFeatureGate,
  useLayer,
} from '@statsig/react-bindings'

export function StatsigExperimentExposure({
  experiment,
}: {
  experiment: string
}) {
  const { isLoading, error } = useContext(StatsigAppBootstrapContext)
  if (isLoading) return null
  if (error) return null
  return <StatsigExperimentEffect experiment={experiment} />
}

export function StatsigGateExposure({ gate }: { gate: string }) {
  const { isLoading, error } = useContext(StatsigAppBootstrapContext)
  if (isLoading) return null
  if (error) return null
  return <StatsigGateEffect gate={gate} />
}

export function StatsigLayerExposure({
  layer,
  parameter,
}: {
  layer: string
  parameter: string
}) {
  const { isLoading, error } = useContext(StatsigAppBootstrapContext)
  if (isLoading) return null
  if (error) return null
  return <StatsigLayerEffect layer={layer} parameter={parameter} />
}

function StatsigExperimentEffect({ experiment }: { experiment: string }) {
  const { details, value } = useExperiment(experiment)

  return <DebugInfoUnlessProduction details={details} value={value} />
}

function StatsigGateEffect({ gate }: { gate: string }) {
  const { details, value } = useFeatureGate(gate)

  return <DebugInfoUnlessProduction details={details} value={value} />
}

function StatsigLayerEffect({
  layer,
  parameter,
}: {
  layer: string
  parameter: string
}) {
  const data = useLayer(layer)
  const value = data.get(parameter)

  return <DebugInfoUnlessProduction details={data.details} value={value} />
}

function DebugInfoUnlessProduction({
  details,
  value,
}: {
  details: Record<string, unknown>
  value: unknown
}) {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') return null

  return (
    <pre className="statsig-debug-info text-sm px-8 py-4 hidden" hidden>
      {JSON.stringify({ value, details }, null, 2)}
    </pre>
  )
}

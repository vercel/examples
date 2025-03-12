'use client'

import { Statsig } from '@flags-sdk/statsig'
/**
 * This file exports a StatsigProvider with a client-side bootstrap.
 * It requires a client-side fetch to retrieve the bootstrap payload.
 * Elements that determine page layout should have precomputed variants with flags-sdk.
 * Exposures can be logged with helpers in the `statsig-exposure` module.
 */

import {
  LogLevel,
  StatsigProvider,
  useClientBootstrapInit,
} from '@statsig/react-bindings'
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics'
import { createContext, useMemo } from 'react'
import useSWR from 'swr'

export const StatsigAppBootstrapContext = createContext<{
  isLoading: boolean
  error: Error | null
}>({
  isLoading: true,
  error: null,
})

function BootstrappedStatsigProvider({
  user,
  values,
  children,
}: {
  user: Parameters<typeof useClientBootstrapInit>[1]
  values: Parameters<typeof useClientBootstrapInit>[2]
  children: React.ReactNode
}) {
  const client = useClientBootstrapInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY as string,
    user,
    values,
    {
      logLevel: LogLevel.Debug,
      plugins: [new StatsigAutoCapturePlugin()],
    }
  )
  return <StatsigProvider client={client}>{children}</StatsigProvider>
}

export function StaticStatsigProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data, error } = useBootstrap()
  const values = useMemo(() => JSON.stringify(data), [data])

  if (!data) {
    return (
      <StatsigAppBootstrapContext.Provider value={{ isLoading: true, error }}>
        {children}
      </StatsigAppBootstrapContext.Provider>
    )
  }

  return (
    <StatsigAppBootstrapContext.Provider value={{ isLoading: false, error }}>
      <BootstrappedStatsigProvider user={data.user} values={values}>
        {children}
      </BootstrappedStatsigProvider>
    </StatsigAppBootstrapContext.Provider>
  )
}

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Vary: 'Cookie',
    },
  }).then((res) => res.json())

export function useBootstrap() {
  return useSWR<
    Awaited<ReturnType<typeof Statsig.getClientInitializeResponse>>
  >('/api/bootstrap', fetcher)
}

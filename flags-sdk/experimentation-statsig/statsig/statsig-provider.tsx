'use client'

/**
 * This file exports a StatsigProvider with a client-side bootstrap.
 *
 * The bootstrap reads the data embedded by Edge Middleware.
 *
 * Elements that determine page layout should have precomputed variants with flags-sdk.
 * Exposures can be logged with helpers in the `statsig-exposure` module.
 */
import type { Statsig, StatsigUser } from '@flags-sdk/statsig'
import {
  LogLevel,
  StatsigProvider,
  useClientBootstrapInit,
} from '@statsig/react-bindings'
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics'
import { createContext, useMemo, useState, useEffect } from 'react'

export const StatsigAppBootstrapContext = createContext<{
  isLoading: boolean
  error: Error | null
}>({
  isLoading: true,
  error: null,
})

export function useEmbed<T>(id: string, initialData?: T) {
  const [data, setData] = useState<T | undefined>(initialData || undefined)
  useEffect(() => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const text = document.getElementById(id)!.textContent
    setData(text ? JSON.parse(text) : undefined)
  }, [id])
  return data
}

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
  // wait for the script#embed to appear and read its contents as json
  // TODO use actual embed library
  const data = useEmbed<{
    statsigUser: StatsigUser
    clientInitializeResponse: Awaited<
      ReturnType<typeof Statsig.getClientInitializeResponse>
    >
  }>('embed')

  const values = useMemo(
    () => (data ? JSON.stringify(data.clientInitializeResponse) : null),
    [data]
  )

  if (!data || !values) {
    return (
      <StatsigAppBootstrapContext.Provider
        value={{ isLoading: true, error: null }}
      >
        {children}
      </StatsigAppBootstrapContext.Provider>
    )
  }

  return (
    <StatsigAppBootstrapContext.Provider
      value={{ isLoading: false, error: null }}
    >
      <BootstrappedStatsigProvider user={data.statsigUser} values={values}>
        {children}
      </BootstrappedStatsigProvider>
    </StatsigAppBootstrapContext.Provider>
  )
}

'use client';

import type { LDContext } from '@flags-sdk/launchdarkly';
import { type LDFlagSet, LDProvider } from 'launchdarkly-react-client-sdk';
/**
 * This file exports an LDProvider with a client-side bootstrap.
 * It requires a client-side fetch to retrieve the bootstrap payload.
 * Elements that determine page layout should have precomputed variants with flags-sdk.
 * Exposures can be logged with helpers in the `launchdarkly-flag-exposure` module.
 */

import { createContext } from 'react';
import useSWR from 'swr';

export const LDAppBootstrapContext = createContext<{
  isLoading: boolean
  error: Error | null
}>({
  isLoading: true,
  error: null,
});

function BootstrappedLDProvider({
  user,
  values,
  children,
}: {
  user: LDContext,
  values: LDFlagSet,
  children: React.ReactNode,
}) {
  return (
    <LDProvider
      clientSideID={process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID ?? ''}
      context={user}
      timeout={5}
      options={{ bootstrap: values, streaming: false }}
    >
      {children}
    </LDProvider>
  );
}

export function StaticLDProvider({
  children,
}: {
  children: React.ReactNode,
}) {
  const { data, error } = useBootstrap();

  if (!data) {
    return (
      <LDAppBootstrapContext.Provider value={{ isLoading: true, error }}>
        {children}
      </LDAppBootstrapContext.Provider>
    );
  }

  return (
    <LDAppBootstrapContext.Provider value={{ isLoading: false, error }}>
      <BootstrappedLDProvider user={data.user} values={data.values}>
        {children}
      </BootstrappedLDProvider>
    </LDAppBootstrapContext.Provider>
  );
}

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Vary: 'Cookie',
    },
  }).then((res) => res.json());

export function useBootstrap() {
  return useSWR<
    Awaited<{ user: LDContext, values: LDFlagSet }>
  >('/api/bootstrap', fetcher);
}

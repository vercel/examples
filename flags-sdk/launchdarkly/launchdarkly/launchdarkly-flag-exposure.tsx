'use client';

import type { LDClient } from 'launchdarkly-react-client-sdk';
import { useEffect } from 'react';

/**
 * This file exports exposure helpers for Static/ISR pages.
 */

export function useLDFlagExposure(flagKey: string, ldClient?: LDClient) {
  useEffect(() => {
    if (ldClient) {
      ldClient.variation(flagKey);
      if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
        console.log(`${flagKey} exposure`);
      }
    }
  }, [ldClient]);
}

export function trackLDEvent(eventKey: string, ldClient?: LDClient) {
  if (ldClient) {
    ldClient.track(eventKey);
    if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
      console.log(`${eventKey} tracked`);
    }
  }
}

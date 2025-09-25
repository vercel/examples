'use client';

import { FreeDeliveryBanner } from '@/components/banners/free-delivery-banner';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { useLDFlagExposure } from '@/launchdarkly/launchdarkly-flag-exposure';

export function FreeDelivery({
  flagKey,
  show,
}: {
  flagKey: string;
  show: boolean;
}) {
  const ldClient = useLDClient();
  useLDFlagExposure(flagKey, ldClient);
  return (
    <>
      {show ? <FreeDeliveryBanner /> : null}
    </>
  );
}

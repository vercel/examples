'use client';

import { FreeDeliveryBanner } from '@/components/banners/free-delivery-banner';
import { type LDClient, withLDConsumer } from 'launchdarkly-react-client-sdk';
import { useLDFlagExposure } from '@/launchdarkly/launchdarkly-flag-exposure';

function FreeDeliveryImpl({
  flagKey,
  show,
  ldClient,
}: {
  flagKey: string;
  show: boolean;
  ldClient?: LDClient;
}) {
  useLDFlagExposure(flagKey, ldClient);
  return (
    <>
      {show ? <FreeDeliveryBanner /> : null}
    </>
  );
}

export const FreeDelivery = withLDConsumer({ clientOnly: true })(FreeDeliveryImpl);

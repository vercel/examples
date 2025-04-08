'use client'

import { toast } from 'sonner';
import { SummerSaleBanner } from '@/components/banners/summer-sale-banner';
import { type LDClient, withLDConsumer } from 'launchdarkly-react-client-sdk';
import { useLDFlagExposure, trackLDEvent } from '@/launchdarkly/launchdarkly-flag-exposure';

function SummerSaleImpl({
  flagKey,
  show,
  ldClient,
}: {
  show: boolean;
  flagKey: string;
  ldClient?: LDClient;
}) {
  useLDFlagExposure(flagKey, ldClient);
  return (
    <>
      {show && (
        <SummerSaleBanner
          onClick={() => {
            trackLDEvent('summer-sale-clicked', ldClient);
            toast('End reached', {
              className: 'my-classname',
              description:
                'The summer sale is not implemented in this template. Try adding to the cart instead.',
            });
          }}
        />
      )}
    </>
  );
}

export const SummerSale = withLDConsumer({ clientOnly: true })(SummerSaleImpl);

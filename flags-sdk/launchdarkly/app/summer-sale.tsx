'use client'

import { toast } from 'sonner';
import { SummerSaleBanner } from '@/components/banners/summer-sale-banner';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { useLDFlagExposure, trackLDEvent } from '@/launchdarkly/launchdarkly-flag-exposure';

export function SummerSale({
  flagKey,
  show,
}: {
  show: boolean;
  flagKey: string;
}) {
  const ldClient = useLDClient();
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

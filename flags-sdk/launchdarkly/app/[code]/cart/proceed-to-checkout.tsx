'use client'

import { ProceedToCheckoutButton } from '@/components/shopping-cart/proceed-to-checkout-button';
import { toast } from 'sonner';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { useLDFlagExposure, trackLDEvent } from '@/launchdarkly/launchdarkly-flag-exposure';

export function ProceedToCheckout({
  color,
  flagKey,
}: {
  color: string;
  flagKey: string;
}) {
  const ldClient = useLDClient();
  useLDFlagExposure(flagKey, ldClient);
  return (
    <>
      <ProceedToCheckoutButton
        color={color}
        onClick={() => {
          trackLDEvent('proceed-to-checkout-clicked', ldClient);
          toast('End reached', {
            className: 'my-classname',
            description:
              'The checkout flow is not implemented in this template.',
            duration: 5000,
          });
        }}
      />
    </>
  );
}

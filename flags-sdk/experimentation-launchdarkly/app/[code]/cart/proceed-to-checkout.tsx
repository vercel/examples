'use client'

import { ProceedToCheckoutButton } from '@/components/shopping-cart/proceed-to-checkout-button';
import { toast } from 'sonner';
import { type LDClient, withLDConsumer } from 'launchdarkly-react-client-sdk';
import { useLDFlagExposure, trackLDEvent } from '@/launchdarkly/launchdarkly-flag-exposure';

function ProceedToCheckoutImpl({
  color,
  flagKey,
  ldClient,
}: {
  color: string;
  flagKey: string;
  ldClient?: LDClient;
}) {
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

export const ProceedToCheckout = withLDConsumer({ clientOnly: true })(ProceedToCheckoutImpl);

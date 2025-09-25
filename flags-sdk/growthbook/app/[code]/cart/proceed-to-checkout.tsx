'use client'

import { ProceedToCheckoutButton } from '@/components/shopping-cart/proceed-to-checkout-button'
import { toast } from 'sonner'

export function ProceedToCheckout({ color }: { color: string }) {
  return (
    <>
      <ProceedToCheckoutButton
        color={color}
        onClick={() => {
          // Auto capture will track the event
          toast('End reached', {
            className: 'my-classname',
            description:
              'The checkout flow is not implemented in this template.',
            duration: 5000,
          })
        }}
      />
    </>
  )
}

'use client'

import { ProceedToCheckoutButton } from '@/components/shopping-cart/proceed-to-checkout-button'
import { StatsigExperimentExposure } from '@/statsig/statsig-gate-exposure'
import { toast } from 'sonner'

export function ProceedToCheckout({
  color,
  experiment,
}: {
  color: string
  experiment: string
}) {
  return (
    <>
      <StatsigExperimentExposure experiment={experiment} />
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

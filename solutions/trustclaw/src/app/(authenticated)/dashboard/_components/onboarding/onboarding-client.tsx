'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '~/clients/trpc'
import { Onboarding } from './onboarding'
import { OnboardingSkeleton } from './onboarding.skeleton'

interface OnboardingClientProps {
  hasExistingInstance: boolean
  hasOnboardingState: boolean
}

export function OnboardingClient({
  hasExistingInstance,
  hasOnboardingState,
}: OnboardingClientProps) {
  const router = useRouter()

  const { data, isLoading } = trpc.trustclaw.getInstance.useQuery(undefined, {
    enabled: hasOnboardingState,
  })

  if (hasOnboardingState && isLoading) {
    return <OnboardingSkeleton />
  }

  return (
    <Onboarding
      hasExistingInstance={hasExistingInstance}
      savedState={data?.onboardingState ?? null}
      onComplete={() => router.refresh()}
    />
  )
}

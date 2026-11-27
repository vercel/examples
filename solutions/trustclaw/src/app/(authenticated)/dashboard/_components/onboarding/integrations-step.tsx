'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check, ExternalLink, Loader2 } from 'lucide-react'
import { trpc } from '~/clients/trpc'
import { Button } from '~/components/ui/button'
import { showSuccessToast } from '~/components/core/toast-notifications'
import { IntegrationsStepSkeleton } from './integrations-step.skeleton'
import Image from 'next/image'
import { INTEGRATION_DESCRIPTIONS } from './onboarding.consts'
import { StepLayout, itemVariants } from './step-layout'

interface IntegrationsStepProps {
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

export function IntegrationsStep({
  onNext,
  onBack,
  onSkip,
}: IntegrationsStepProps) {
  const [pendingToolkits, setPendingToolkits] = useState<Set<string>>(new Set())
  const prevConnectedRef = useRef<Set<string>>(new Set())
  const initializedRef = useRef(false)

  const { data, isLoading, error, refetch } =
    trpc.trustclaw.getIntegrationAuthLinks.useQuery(undefined, {
      refetchInterval: 5000,
    })

  const integrations = useMemo(() => data?.integrations ?? [], [data])

  useEffect(() => {
    const currentConnected = new Set(
      integrations.filter((i) => i.connected).map((i) => i.toolkit)
    )

    if (initializedRef.current) {
      for (const toolkit of currentConnected) {
        if (!prevConnectedRef.current.has(toolkit)) {
          const name =
            integrations.find((i) => i.toolkit === toolkit)?.name ?? toolkit
          showSuccessToast(`${name} connected!`)
          setPendingToolkits((prev) => {
            const next = new Set(prev)
            next.delete(toolkit)
            return next
          })
        }
      }
    }

    initializedRef.current = true
    prevConnectedRef.current = currentConnected
  }, [integrations])

  if (isLoading) {
    return <IntegrationsStepSkeleton />
  }

  if (error) {
    return (
      <StepLayout
        title="Connect my tools!"
        subtitle="Something went wrong loading integrations."
        onBack={onBack}
        onSkip={onSkip}
      >
        <motion.div variants={itemVariants} className="flex justify-center">
          <Button
            variant="outline"
            className="min-h-[44px]"
            onClick={() => void refetch()}
          >
            Try again
          </Button>
        </motion.div>
      </StepLayout>
    )
  }

  const connectedCount = integrations.filter((i) => i.connected).length
  const total = integrations.length

  const handleConnect = (toolkit: string, redirectUrl: string) => {
    setPendingToolkits((prev) => new Set(prev).add(toolkit))
    window.open(redirectUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <StepLayout
      title="Connect my tools!"
      subtitle="These let me work with your favorite services"
      onNext={onNext}
      onBack={onBack}
      onSkip={onSkip}
    >
      <motion.div variants={itemVariants} className="text-center">
        <p className="text-sm font-medium">
          {connectedCount === total
            ? `${connectedCount}/${total} tools connected, good job!`
            : `${connectedCount}/${total} tools connected, connect another!`}
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        {integrations.map((integration) => {
          const isPending = pendingToolkits.has(integration.toolkit)

          return (
            <div
              key={integration.toolkit}
              className="border-border flex min-h-[44px] items-center justify-between rounded-lg border p-4"
            >
              {integration.logo && (
                <Image
                  width={32}
                  height={32}
                  src={integration.logo}
                  alt={integration.name}
                  unoptimized
                  className={`h-8 w-8 shrink-0 rounded ${
                    integration.toolkit === 'github' ? 'dark:invert' : ''
                  }`}
                />
              )}
              <div className="ml-3 min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {integration.name}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {INTEGRATION_DESCRIPTIONS[integration.toolkit] ?? ''}
                </p>
              </div>
              {integration.connected ? (
                <div className="text-primary ml-3 flex items-center gap-1 text-sm font-medium">
                  <Check className="h-4 w-4" />
                  Connected
                </div>
              ) : isPending ? (
                <div className="text-muted-foreground ml-3 flex items-center gap-1.5 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Waiting...
                </div>
              ) : integration.redirectUrl ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-3 min-h-[44px] shrink-0"
                  onClick={() =>
                    handleConnect(integration.toolkit, integration.redirectUrl!)
                  }
                >
                  Connect
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              ) : (
                <span className="text-muted-foreground ml-3 text-xs">
                  Unavailable
                </span>
              )}
            </div>
          )
        })}
      </motion.div>

      <motion.div variants={itemVariants}>
        <p className="text-muted-foreground text-center text-xs">
          I support 1000+ more tools - just ask me in the chat later
        </p>
      </motion.div>
    </StepLayout>
  )
}

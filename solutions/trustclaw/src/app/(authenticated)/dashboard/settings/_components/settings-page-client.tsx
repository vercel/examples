'use client'

import { Settings } from 'lucide-react'
import { trpc } from '~/clients/trpc'
import Link from 'next/link'
import { ErrorDisplay } from '~/components/core/error-display'
import { ErrorBoundary } from '~/components/core/error-boundary'
import { ModelSettings } from './model-settings'
import { TelegramSettings } from './telegram-settings'
import { CronJobsSettings } from './cron-jobs-settings'
import { MemorySettings } from './memory-settings'
import { DangerZone } from './danger-zone'
import { SettingsPageSkeleton } from './settings-page.skeleton'

export function SettingsPageClient() {
  const { data, isLoading, error } = trpc.trustclaw.getInstance.useQuery()
  const instance = data?.instance ?? null

  if (isLoading) {
    return <SettingsPageSkeleton />
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error.message}
        retryText="Try again"
        onRetry={() => window.location.reload()}
      />
    )
  }

  if (!instance) {
    return (
      <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
        <div className="text-center">
          <p className="text-muted-foreground">No TrustClaw instance found.</p>
          <Link
            href="/dashboard"
            className="text-primary mt-2 inline-block hover:underline"
          >
            Go to TrustClaw
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <Settings className="text-muted-foreground h-5 w-5" />
        <h1 className="text-xl font-semibold md:text-2xl">Settings</h1>
      </div>

      <ErrorBoundary>
        <ModelSettings currentModel={instance.anthropicModel} />
      </ErrorBoundary>

      {data?.telegramConfigured && (
        <ErrorBoundary>
          <TelegramSettings />
        </ErrorBoundary>
      )}

      <ErrorBoundary>
        <CronJobsSettings />
      </ErrorBoundary>

      <ErrorBoundary>
        <MemorySettings />
      </ErrorBoundary>

      <ErrorBoundary>
        <DangerZone />
      </ErrorBoundary>
    </div>
  )
}

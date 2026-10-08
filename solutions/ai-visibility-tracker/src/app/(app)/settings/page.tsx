import type { Metadata } from 'next'
import { logout } from '@/app/actions/auth'
import { Muted, Notice, PageHeader, Section } from '@/components/blocks'
import { BrandForm } from '@/components/brand-form'
import { ModelsForm, type ModelRow } from '@/components/models-form'
import { Button } from '@/components/ui/button'
import {
  extractorAvailability,
  platformAvailability,
  transport,
} from '@/lib/ai/provider'
import { isAuthenticated } from '@/lib/auth/session'
import { databaseUrl, getDb } from '@/lib/db'
import { DEMO_READ_ONLY_MESSAGE, isDemoMode } from '@/lib/demo'
import {
  EXTRACTOR_KEY,
  PLATFORMS,
  PLATFORM_IDS,
  resolveModelConfig,
} from '@/lib/platforms'
import { getBrand } from '@/lib/queries/brand'
import { getModelOverrides } from '@/lib/queries/settings'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const db = await getDb()
  const brand = (await getBrand(db))!
  const overrides = await getModelOverrides(db)
  const models = resolveModelConfig(overrides)
  const platformOptions = PLATFORM_IDS.map((id) =>
    platformAvailability(id, models.platforms[id])
  )
  const extractor = extractorAvailability(models.extractor)
  const mode = transport()
  const cronConfigured = Boolean(process.env.CRON_SECRET)
  const readOnly = isDemoMode() && !(await isAuthenticated())

  const modelRows: ModelRow[] = [
    ...platformOptions.map((option) => ({
      key: option.id,
      label: PLATFORMS[option.id].label,
      description: PLATFORMS[option.id].description,
      stored: overrides[option.id] ?? null,
      effective: option.modelId,
      available: option.available,
      reason: option.reason,
    })),
    {
      key: EXTRACTOR_KEY,
      label: 'Brand extraction',
      description:
        'Names the brands in each answer and what was said about them.',
      stored: overrides[EXTRACTOR_KEY] ?? null,
      effective: extractor.modelId,
      available: extractor.available,
      reason: extractor.reason,
    },
  ]

  return (
    <>
      <PageHeader title="Settings" />
      {readOnly ? (
        <Notice className="mb-6">{DEMO_READ_ONLY_MESSAGE}</Notice>
      ) : null}

      <Section
        title="Brand"
        description="Changes apply to the next check. Stored answers are not re-analyzed."
      >
        <BrandForm
          brand={brand}
          platformOptions={platformOptions}
          submitLabel="Save"
        />
      </Section>

      <Section
        className="mt-6"
        title="Models"
        description={
          mode === 'gateway'
            ? "Requests go through the Vercel AI Gateway with one key (or the deployment's own identity on Vercel). The team's AI Gateway balance must be positive."
            : 'Requests go directly to each vendor with its own API key. Set AI_GATEWAY_API_KEY to use one key for everything.'
        }
      >
        <ModelsForm rows={modelRows} />
      </Section>

      <Section
        className="mt-6"
        title="Schedule"
        description="A daily check runs at 06:00 UTC through Vercel Cron (vercel.json). Weekly questions are included once every seven days."
      >
        {cronConfigured ? (
          <Muted>
            CRON_SECRET is set. The scheduled check and the background processor
            are protected.
          </Muted>
        ) : (
          <Muted>
            CRON_SECRET is not set. Manual checks work, but the scheduled check
            will not run until it is configured. Generate one with{' '}
            <code className="rounded bg-muted px-1 font-mono text-xs">
              openssl rand -hex 32
            </code>
            .
          </Muted>
        )}
      </Section>

      <Section
        className="mt-6"
        title="Data"
        description={
          databaseUrl()
            ? 'Stored in your Postgres database.'
            : 'Stored in the embedded PGlite database under ./data/pglite.'
        }
      >
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-muted-foreground">Export answers as CSV:</span>
          {['7d', '30d', '90d'].map((period) => (
            <a
              key={period}
              href={`/api/export/answers?period=${period}`}
              className="underline-offset-4 hover:underline"
            >
              last {period}
            </a>
          ))}
        </div>
      </Section>

      <Section className="mt-6" title="Session">
        <form action={logout}>
          <Button type="submit" variant="outline">
            Log out
          </Button>
        </form>
      </Section>
    </>
  )
}

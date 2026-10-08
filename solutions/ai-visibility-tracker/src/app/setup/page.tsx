import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BrandForm } from '@/components/brand-form'
import { Card, CardContent } from '@/components/ui/card'
import { platformAvailability } from '@/lib/ai/provider'
import { getDb } from '@/lib/db'
import { PLATFORM_IDS } from '@/lib/platforms'
import { getBrand } from '@/lib/queries/brand'
import { getModelConfig } from '@/lib/queries/settings'

export const metadata: Metadata = { title: 'Set up' }

export default async function SetupPage() {
  const db = await getDb()
  if (await getBrand(db)) redirect('/settings')
  const models = await getModelConfig(db)
  const platformOptions = PLATFORM_IDS.map((id) =>
    platformAvailability(id, models.platforms[id])
  )

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-xs font-medium text-muted-foreground">Step 1 of 2</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        Which brand are we tracking?
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Next you add the questions your customers ask, then run the first check.
      </p>
      <Card className="mt-8">
        <CardContent>
          <BrandForm
            brand={null}
            platformOptions={platformOptions}
            submitLabel="Continue"
          />
        </CardContent>
      </Card>
    </main>
  )
}

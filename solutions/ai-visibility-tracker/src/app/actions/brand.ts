'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { normalizeDomain } from '@/lib/analysis/mentions'
import { writeDenied } from '@/lib/auth/session'
import { getDb } from '@/lib/db'
import { brands } from '@/lib/db/schema'
import { isCountryCode, isLanguageCode } from '@/lib/markets'
import { normalizePlatformList } from '@/lib/platforms'
import { getBrand } from '@/lib/queries/brand'

export interface BrandFormState {
  error: string | null
  saved: boolean
}

const brandSchema = z.object({
  name: z.string().trim().min(1, 'Brand name is required').max(120),
  aliases: z.array(z.string().trim().min(1).max(80)).max(20),
  domain: z.string().trim().min(1, 'Website is required'),
  country: z.string().trim(),
  language: z.string().trim(),
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
})

export async function saveBrand(
  _previous: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  const denied = await writeDenied()
  if (denied) return { error: denied, saved: false }

  const parsed = brandSchema.safeParse({
    name: formData.get('name'),
    aliases: String(formData.get('aliases') ?? '')
      .split(/[\n,]/)
      .map((a) => a.trim())
      .filter(Boolean),
    domain: formData.get('domain'),
    country: formData.get('country') ?? '',
    language: formData.get('language') ?? '',
    platforms: formData.getAll('platforms'),
  })
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? 'Invalid input',
      saved: false,
    }
  }

  const domain = normalizeDomain(parsed.data.domain)
  if (!domain.includes('.'))
    return {
      error: 'Enter the website as a domain, for example brand.com',
      saved: false,
    }
  const platforms = normalizePlatformList(parsed.data.platforms)
  if (platforms.length === 0)
    return { error: 'Select at least one platform', saved: false }

  const values = {
    name: parsed.data.name,
    aliases: Array.from(
      new Set(
        parsed.data.aliases.filter(
          (a) => a.toLowerCase() !== parsed.data.name.toLowerCase()
        )
      )
    ),
    domain,
    country: isCountryCode(parsed.data.country) ? parsed.data.country : null,
    language: isLanguageCode(parsed.data.language)
      ? parsed.data.language
      : null,
    platforms,
    updatedAt: new Date(),
  }

  const db = await getDb()
  const existing = await getBrand(db)
  if (existing) {
    await db.update(brands).set(values).where(eq(brands.id, existing.id))
    revalidatePath('/', 'layout')
    return { error: null, saved: true }
  }

  await db.insert(brands).values(values)
  revalidatePath('/', 'layout')
  redirect('/questions?welcome=1')
}

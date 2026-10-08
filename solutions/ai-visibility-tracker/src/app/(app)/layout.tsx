import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { Shell } from '@/components/shell'
import { isAuthenticated } from '@/lib/auth/session'
import { isDemoMode } from '@/lib/demo'
import { getDb } from '@/lib/db'
import { getBrand } from '@/lib/queries/brand'
import { activeRun } from '@/lib/queries/runs'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const db = await getDb()
  const brand = await getBrand(db)
  if (!brand) redirect('/setup')
  const running = await activeRun(db, brand.id)
  const readOnly = isDemoMode() && !(await isAuthenticated())
  return (
    <Shell brand={brand} running={running} readOnly={readOnly}>
      {children}
    </Shell>
  )
}

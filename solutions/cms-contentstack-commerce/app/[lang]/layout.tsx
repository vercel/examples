/**
 * We use a nested layout to define all the possible languages supported by all pages after /[lang]
 */

import type { ReactNode } from 'react'
import { LOCALES } from '@lib/i18n'

// Only the known locales are supported
export const dynamicParams = false

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

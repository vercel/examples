import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { VercelToolbar } from '@vercel/toolbar/next'
import { FlagValues } from '@vercel/flags/react'
import { Suspense } from 'react'
import { FlagValuesType, encrypt } from '@vercel/flags'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Toolbar Flags',
}

async function ConfidentialFlagValues({
  flagValues,
}: {
  flagValues: FlagValuesType
}) {
  const encryptedFlagValues = await encrypt(flagValues)
  return <FlagValues values={encryptedFlagValues} />
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const flags = { instructions: true }

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/*
          ⚠️ This shows the toolbar to all visitors

          See detailed instructions to limit who can see the toolbar for real applications:
          https://vercel.com/docs/workflow-collaboration/vercel-toolbar/in-production-and-localhost/add-to-production
        */}
        <VercelToolbar />
        {/* Render this tag to tell the application about your flags */}
        <Suspense fallback={null}>
          <ConfidentialFlagValues flagValues={flags} />
        </Suspense>
      </body>
    </html>
  )
}

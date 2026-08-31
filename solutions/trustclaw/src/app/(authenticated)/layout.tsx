import { auth } from '~/server/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ErrorDisplay } from '~/components/core/error-display'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const reqHeaders = await headers()

  // Only the session lookup can fail with a recoverable error (DB
  // unreachable, auth service down). `redirect()` throws a Next.js
  // control-flow exception that must propagate to the framework — wrapping
  // it in a try/catch turns "no session" into an error screen instead of a
  // redirect, so keep the redirect call outside the catch.
  let session: Awaited<ReturnType<typeof auth.api.getSession>>
  try {
    session = await auth.api.getSession({ headers: reqHeaders })
  } catch {
    return (
      <ErrorDisplay
        message="We're having trouble reaching our servers. Please check your connection and try again."
        onRetry="refresh"
        retryText="Refresh Page"
      />
    )
  }

  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
}

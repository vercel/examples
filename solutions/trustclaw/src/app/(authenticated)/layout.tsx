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

  try {
    const session = await auth.api.getSession({ headers: reqHeaders })
    if (!session) {
      redirect('/login')
    }

    return <>{children}</>
  } catch {
    return (
      <ErrorDisplay
        message="We're having trouble reaching our servers. Please check your connection and try again."
        onRetry="refresh"
        retryText="Refresh Page"
      />
    )
  }
}

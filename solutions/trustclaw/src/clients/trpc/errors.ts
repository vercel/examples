import { TRPCClientError } from '@trpc/client'
import type { InferrableClientTypes } from '@trpc/server/unstable-core-do-not-import'

const CODE_DESCRIPTIONS: Record<string, string> = {
  UNAUTHORIZED: 'Please log in again',
  FORBIDDEN: "You don't have permission to do this",
  NOT_FOUND: 'The requested resource was not found',
  CONFLICT: 'This resource already exists',
  TOO_MANY_REQUESTS: 'Please wait a moment and try again',
  TIMEOUT: 'The request timed out - please try again',
  INTERNAL_SERVER_ERROR: 'Something went wrong on our end',
}

export function isTrpcError(
  error: unknown
): error is TRPCClientError<InferrableClientTypes> {
  return error instanceof TRPCClientError
}

export function parseTrpcError(error: unknown): {
  title: string
  description?: string
} {
  const defaultMessage =
    'Something went wrong. Our team has been notified and we are on it!'

  if (isTrpcError(error)) {
    const code = (error.data as Record<string, unknown> | undefined)?.code as
      | string
      | undefined
    const friendlyTitle =
      (code ? CODE_DESCRIPTIONS[code] : undefined) ?? defaultMessage

    return { title: friendlyTitle }
  }

  return { title: defaultMessage }
}

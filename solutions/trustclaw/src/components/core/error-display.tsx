'use client'

import { Button } from '~/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ErrorDisplayProps {
  message: string
  retryText: string
  onRetry: (() => void) | Omit<string, 'refresh'> | 'refresh'
}

export function ErrorDisplay({
  message,
  retryText,
  onRetry,
}: ErrorDisplayProps) {
  const router = useRouter()
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertCircle className="text-destructive h-12 w-12" />
      <p className="text-muted-foreground text-sm">{message}</p>
      {typeof onRetry === 'function' && (
        <Button variant="outline" onClick={onRetry}>
          {retryText}
        </Button>
      )}
      {typeof onRetry === 'string' && onRetry !== 'refresh' && (
        <Button variant="outline" onClick={() => router.push(onRetry)}>
          {retryText}
        </Button>
      )}
      {onRetry === 'refresh' && (
        <Button variant="outline" onClick={() => router.refresh()}>
          {retryText}
        </Button>
      )}
    </div>
  )
}

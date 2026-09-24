'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Check,
  Copy,
  ExternalLink,
  Loader2,
  MessageSquare,
  Unlink,
} from 'lucide-react'
import { trpc } from '~/clients/trpc'
import { Button } from '~/components/ui/button'
import Link from 'next/link'
import { AlertDialog } from '~/components/core/confirm-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import {
  showSuccessToast,
  trpcToastOnError,
} from '~/components/core/toast-notifications'

export function TelegramSettings() {
  const [commandCopied, setCommandCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const utils = trpc.useUtils()

  // Cleanup the "copied" indicator timer on unmount.
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const linkTelegram = trpc.trustclaw.linkTelegram.useMutation({
    onError: trpcToastOnError,
  })

  const telegramToken = linkTelegram.data?.token ?? null
  const botUsername = linkTelegram.data?.botUsername ?? null

  // Single source of truth: the instance query. Poll while we're waiting for
  // the user to send /start to BotFather; otherwise just read the steady-state
  // value. Derive isLinked directly from the query so we don't have to mirror
  // server state into local useState (the prior implementation did and needed
  // a useEffect to keep the two in sync — classic anti-pattern).
  const { data: instanceData } = trpc.trustclaw.getInstance.useQuery(
    undefined,
    {
      refetchInterval: telegramToken ? 3000 : false,
    }
  )
  const isLinked = !!instanceData?.instance?.telegramChatId

  // When the link finally completes, surface a toast and clear the pending
  // token so the UI flips to the linked state.
  useEffect(() => {
    if (isLinked && telegramToken) {
      showSuccessToast('Telegram linked successfully!')
      linkTelegram.reset()
    }
  }, [isLinked, telegramToken, linkTelegram])

  const unlinkTelegram = trpc.trustclaw.unlinkTelegram.useMutation({
    onSuccess: () => {
      showSuccessToast('Telegram unlinked')
      linkTelegram.reset()
      void utils.trustclaw.getInstance.invalidate()
    },
    onError: trpcToastOnError,
  })

  const handleCopyCommand = useCallback(async () => {
    if (!telegramToken) return
    await navigator.clipboard.writeText(`/start ${telegramToken}`)
    setCommandCopied(true)
    showSuccessToast('Copied to clipboard!')
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    copyTimeoutRef.current = setTimeout(() => setCommandCopied(false), 2000)
  }, [telegramToken])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Telegram</CardTitle>
        <CardDescription>
          Chat with TrustClaw from Telegram - messages sync with the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLinked ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Connected to Telegram</span>
              <Badge variant="secondary">Linked</Badge>
            </div>
            <AlertDialog
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  disabled={unlinkTelegram.isPending}
                >
                  {unlinkTelegram.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Unlink className="mr-2 h-4 w-4" />
                  )}
                  Unlink
                </Button>
              }
              title="Unlink Telegram"
              description="This will disconnect Telegram from your TrustClaw instance. You can re-link it later."
              confirmLabel="Unlink"
              onConfirm={() => void unlinkTelegram.mutateAsync()}
              isPending={unlinkTelegram.isPending}
            />
          </div>
        ) : telegramToken && botUsername ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Send this command to{' '}
              <Link
                href={`https://t.me/${botUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                @{botUsername}
                <ExternalLink className="h-3 w-3" />
              </Link>{' '}
              on Telegram:
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted p-3">
              <code className="min-w-0 flex-1 truncate font-mono text-sm">
                /start {telegramToken}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCommand}
                className="shrink-0"
              >
                {commandCopied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Waiting for Telegram link...
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => void linkTelegram.mutateAsync()}
            disabled={linkTelegram.isPending}
          >
            {linkTelegram.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating link...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Link Telegram
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

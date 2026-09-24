'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, ExternalLink, Loader2, MessageSquare } from 'lucide-react'
import { trpc } from '~/clients/trpc'
import {
  showSuccessToast,
  showErrorToast,
  trpcToastOnError,
} from '~/components/core/toast-notifications'
import { Button } from '~/components/ui/button'
import Link from 'next/link'
import { StepLayout, itemVariants } from './step-layout'

interface TelegramStepProps {
  onBack: () => void
  onSkip: () => void
  onComplete: () => void
}

export function TelegramStep({
  onBack,
  onSkip,
  onComplete,
}: TelegramStepProps) {
  const [commandCopied, setCommandCopied] = useState(false)
  const [telegramLinked, setTelegramLinked] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const linkTelegram = trpc.trustclaw.linkTelegram.useMutation({
    onError: trpcToastOnError,
  })

  const telegramToken = linkTelegram.data?.token ?? null
  const telegramBotUsername = linkTelegram.data?.botUsername ?? null

  const { data: instanceData } = trpc.trustclaw.getInstance.useQuery(
    undefined,
    {
      enabled: !!telegramToken && !telegramLinked,
      refetchInterval: telegramToken && !telegramLinked ? 3000 : false,
    }
  )

  useEffect(() => {
    if (instanceData?.instance?.telegramChatId && !telegramLinked) {
      setTelegramLinked(true)
      showSuccessToast('Telegram linked successfully!')
    }
  }, [instanceData?.instance?.telegramChatId, telegramLinked])

  const handleCopyCommand = useCallback(async () => {
    if (!telegramToken) return
    try {
      await navigator.clipboard.writeText(`/start ${telegramToken}`)
      setCommandCopied(true)
      showSuccessToast('Copied to clipboard!')
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCommandCopied(false), 2000)
    } catch {
      showErrorToast('Failed to copy, please copy manually')
    }
  }, [telegramToken])

  return (
    <StepLayout
      title="Chat with me on Telegram!"
      subtitle="Messages sync with this dashboard"
      onNext={telegramLinked ? onComplete : undefined}
      onBack={onBack}
      onSkip={onSkip}
    >
      <motion.div variants={itemVariants}>
        {telegramLinked ? (
          <div className="border-primary/20 bg-primary/5 rounded-lg border p-4 text-center">
            <Check className="text-primary mx-auto mb-2 h-8 w-8" />
            <p className="text-primary font-medium">
              Telegram linked successfully!
            </p>
          </div>
        ) : !telegramToken ? (
          <div className="space-y-3 text-center">
            <Button
              onClick={() =>
                void linkTelegram.mutateAsync().catch(() => {
                  // fire-and-forget; onError handles display
                })
              }
              variant="outline"
              size="lg"
              disabled={linkTelegram.isPending}
              className="w-full sm:w-auto"
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
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-muted-foreground text-center text-sm">
                Send this command to{' '}
                <Link
                  href={`https://t.me/${telegramBotUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
                >
                  @{telegramBotUsername}
                  <ExternalLink className="h-3 w-3" />
                </Link>{' '}
                on Telegram:
              </p>

              <div className="border-border bg-muted flex items-center gap-2 rounded-lg border p-3">
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
                    <Check className="text-primary h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Waiting for Telegram link...
            </div>
          </div>
        )}
      </motion.div>
    </StepLayout>
  )
}

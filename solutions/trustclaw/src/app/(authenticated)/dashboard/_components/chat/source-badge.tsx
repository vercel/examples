'use client'

import { Badge } from '~/components/ui/badge'

interface SourceBadgeProps {
  source?: 'web' | 'telegram' | 'cron'
}

const SOURCE_LABELS: Record<string, string> = {
  telegram: 'via Telegram',
  cron: 'via scheduled task',
}

export function SourceBadge({ source }: SourceBadgeProps) {
  if (!source || source === 'web') return null

  const label = SOURCE_LABELS[source]
  if (!label) return null

  return (
    <Badge
      variant="outline"
      className="text-xs font-normal text-muted-foreground"
    >
      {label}
    </Badge>
  )
}

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { UseRealtime } from '@/hooks/use-realtime'

const STATUS_META = {
  connecting: { dot: 'bg-amber-500', label: 'Connecting' },
  connected: { dot: 'bg-emerald-500', label: 'Live' },
  disconnected: { dot: 'bg-red-500', label: 'Reconnecting' },
} as const

/** Max avatars shown before collapsing the rest into a "+N" chip. */
const MAX_AVATARS = 6

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function PresenceBar({ rt }: { rt: UseRealtime }) {
  const status = STATUS_META[rt.status]

  // Self first (labelled "you"), then everyone else.
  const everyone = [
    ...(rt.self ? [{ ...rt.self, label: `${rt.self.name} (you)` }] : []),
    ...rt.others.map((peer) => ({ ...peer, label: peer.name })),
  ]

  const shown = everyone.slice(0, MAX_AVATARS)
  const overflow = everyone.length - shown.length

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-full ring ring-border bg-background px-3 py-1.5">
        <span className="relative flex size-2">
          <span
            className={cn(
              'absolute inline-flex size-full animate-ping rounded-full opacity-60',
              status.dot,
            )}
          />
          <span
            className={cn(
              'relative inline-flex size-2 rounded-full',
              status.dot,
            )}
          />
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {status.label}
        </span>
      </div>

      <div className="flex -space-x-2">
        {shown.map((peer) => (
          <Tooltip key={peer.id}>
            <TooltipTrigger
              render={<Avatar className="size-7 ring-2 ring-background" />}
            >
              <AvatarFallback
                className="text-[11px] font-semibold text-white"
                style={{ backgroundColor: peer.color }}
              >
                {initials(peer.name)}
              </AvatarFallback>
            </TooltipTrigger>
            <TooltipContent>{peer.label}</TooltipContent>
          </Tooltip>
        ))}
        {overflow > 0 && (
          <Avatar className="size-7 ring-2 ring-background">
            <AvatarFallback className="bg-muted text-[11px] font-semibold text-muted-foreground">
              +{overflow}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <span className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{rt.count}</span>{' '}
        {rt.count === 1 ? 'person' : 'people'} here
      </span>
    </div>
  )
}

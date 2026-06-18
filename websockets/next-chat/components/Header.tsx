import { PresenceStack } from '@/components/PresenceStack'
import { VercelLogo } from '@/components/icons'
import type { ConnectionState, Presence } from '@/lib/useChatSocket'

function statusFor(
  connectionState: ConnectionState,
  presence: Presence | null
): { dot: string; text: string } {
  if (connectionState === 'connected') {
    if (presence) {
      return {
        dot: 'on',
        text: presence.count === 1 ? '1 online' : `${presence.count} online`,
      }
    }
    return { dot: 'on', text: 'connected' }
  }
  if (connectionState === 'connecting') return { dot: '', text: 'connecting…' }
  if (connectionState === 'error')
    return { dot: 'off', text: 'connection error' }
  return { dot: 'off', text: 'disconnected' }
}

export function Header({
  connectionState,
  presence,
}: {
  connectionState: ConnectionState
  presence: Presence | null
}) {
  const status = statusFor(connectionState, presence)
  return (
    <header className="sticky top-0 z-[5] flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-[0.7rem] pt-[max(0.7rem,env(safe-area-inset-top))] backdrop-blur-[16px] backdrop-saturate-[1.8]">
      <div className="flex min-w-0 items-center gap-[0.65rem]">
        <span className="logo text-[24px]" aria-hidden="true">
          <VercelLogo />
        </span>
        <div className="flex min-w-0 flex-col leading-[1.25]">
          <strong className="font-semibold tracking-[-0.01em]">
            WebSocket Chat
          </strong>
          <span className="inline-flex items-center gap-[0.35rem] text-[0.74rem] text-muted">
            {/* Status dot keeps its pulse animation — bespoke, kept in CSS. */}
            <span className={`dot ${status.dot}`.trim()} />
            <span>{status.text}</span>
          </span>
        </div>
      </div>
      <PresenceStack presence={presence} />
    </header>
  )
}

import { Avatar } from '@/components/Avatar'
import type { Presence } from '@/lib/useChatSocket'

const MAX_AVATARS = 4 // header avatars shown before "+N"

export function PresenceStack({ presence }: { presence: Presence | null }) {
  const users = presence?.users ?? []
  const total = presence?.count ?? users.length
  const shown = users.slice(0, MAX_AVATARS)
  const extra = total - shown.length

  return (
    <div className="avatar-stack" aria-hidden="true">
      {shown.map((u) => (
        <Avatar key={u.clientId} name={u.username} id={u.clientId} />
      ))}
      {extra > 0 && <span className="more">+{extra}</span>}
    </div>
  )
}

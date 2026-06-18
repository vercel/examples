import { Avatar } from '@/components/Avatar'
import { colorFor } from '@/lib/avatar'
import type { ChatMessage } from '@/lib/protocol'

function timestamp(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function Message({
  msg,
  isMe,
  grouped,
}: {
  msg: ChatMessage
  isMe: boolean
  grouped: boolean
}) {
  const className =
    'message' + (isMe ? ' me' : '') + (grouped ? ' grouped' : '')
  return (
    <li className={className}>
      <Avatar name={msg.username} id={msg.clientId} />
      <div className="content">
        <div className="meta">
          <span
            className="name"
            style={isMe ? undefined : { color: colorFor(msg.clientId) }}
          >
            {isMe ? 'You' : msg.username}
          </span>
          <span className="time">{timestamp(msg.server_ts)}</span>
        </div>
        {/* React escapes text — no HTML injection. */}
        <div className="body">{msg.message}</div>
      </div>
    </li>
  )
}

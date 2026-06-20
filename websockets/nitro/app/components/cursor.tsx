import type { RemotePeer } from '@/hooks/use-realtime'

/** A single remote participant's cursor and name label. */
export function Cursor({ peer }: { peer: RemotePeer }) {
  return (
    <div
      className="cursor pointer-events-none absolute left-0 top-0 z-20 will-change-transform"
      style={{ left: `${peer.x * 100}%`, top: `${peer.y * 100}%` }}
    >
      <svg
        width="20"
        height="22"
        viewBox="0 0 20 22"
        fill="none"
        className="drop-shadow-sm"
      >
        <path
          d="M3 2.5L16.5 11.5L10.2 12.6L13.4 18.8L10.6 20.2L7.4 13.9L3 17.5L3 2.5Z"
          fill={peer.color}
          stroke="white"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>

      <span
        className="absolute left-4 top-5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium text-white shadow-sm"
        style={{ backgroundColor: peer.color }}
      >
        {peer.name}
      </span>
    </div>
  )
}

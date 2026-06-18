import { useRef, useState } from 'react'
import { REACTIONS, type Reaction } from '../../shared/types/realtime'
import { Button } from '@/components/ui/button'
import { Cursor } from '@/components/cursor'
import { MousePointer2 } from '@/components/icons'
import { cn } from '@/lib/utils'
import type { UseRealtime } from '@/hooks/use-realtime'

export function LiveCanvas({ rt }: { rt: UseRealtime }) {
  const rootRef = useRef<HTMLDivElement>(null)

  // The armed emoji — click the grid to drop it.
  const [selected, setSelected] = useState<Reaction>(REACTIONS[0])

  function toNormalized(event: { clientX: number; clientY: number }) {
    const el = rootRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    return { x: Math.min(Math.max(x, 0), 1), y: Math.min(Math.max(y, 0), 1) }
  }

  function onPointerMove(event: { clientX: number; clientY: number }) {
    const pos = toNormalized(event)
    if (pos) rt.moveCursor(pos.x, pos.y)
  }

  // Drop the selected emoji wherever you click on the canvas.
  function onCanvasClick(event: { clientX: number; clientY: number }) {
    const pos = toNormalized(event)
    if (pos) rt.sendReaction(selected, pos.x, pos.y)
  }

  return (
    <div
      ref={rootRef}
      className="dot-grid relative h-[50vh] min-h-[400px] w-full overflow-hidden rounded-lg border bg-card/30"
      onPointerMove={onPointerMove}
      onClick={onCanvasClick}
    >
      {/* Empty state hint */}
      {rt.others.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <MousePointer2 className="size-8 text-muted-foreground/60" />
          <p className="max-w-xs text-sm text-muted-foreground">
            You're the only one here. Open this page in another tab or share the
            link to see live cursors.
          </p>
        </div>
      )}

      {/* Remote cursors */}
      {rt.others.map((peer) =>
        peer.active ? <Cursor key={peer.id} peer={peer} /> : null,
      )}

      {/* Reaction bursts */}
      {rt.reactions.map((r) => (
        <div
          key={r.key}
          className="reaction pointer-events-none absolute z-30 -translate-x-1/2 select-none text-2xl"
          style={{ left: `${r.x * 100}%`, top: `${r.y * 100}%` }}
        >
          {r.emoji}
        </div>
      ))}

      {/* Reaction picker: arm an emoji, then click the grid to drop it */}
      <div
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="text-xs text-muted-foreground/70">
          Pick an emoji, then click the grid to drop it
        </span>
        <div className="flex items-center gap-1 rounded-full border bg-background/80 p-1 shadow-sm backdrop-blur">
          {REACTIONS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              aria-pressed={selected === emoji}
              onClick={() => setSelected(emoji)}
              className={cn(
                'size-8 justify-center rounded-full p-0 text-lg leading-none transition',
                selected === emoji
                  ? 'scale-110 bg-accent hover:bg-accent'
                  : 'hover:scale-110',
              )}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'

export interface BarRow {
  key: string
  label: ReactNode
  value: number | null
  detail?: string
}

/** Horizontal bars for one measure across a few entities: foreground on a muted track. */
export function BarRows({
  rows,
  formatValue,
}: {
  rows: BarRow[]
  formatValue: (value: number | null) => string
}) {
  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li
          key={row.key}
          className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[minmax(0,10rem)_1fr_auto]"
        >
          <span className="truncate">{row.label}</span>
          <span
            className="h-2 overflow-hidden rounded-full bg-muted"
            aria-hidden
          >
            <span
              className="block h-full rounded-full bg-foreground"
              style={{
                width: `${Math.max(0, Math.min(100, row.value ?? 0))}%`,
              }}
            />
          </span>
          <span className="num w-24 text-right sm:w-28">
            {formatValue(row.value)}
            {row.detail ? (
              <span className="ml-1 text-xs text-muted-foreground">
                {row.detail}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  )
}

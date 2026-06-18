import { colorFor, initials } from '@/lib/avatar'

export function Avatar({
  name,
  id,
  className,
}: {
  name: string
  id: string | null | undefined
  className?: string
}) {
  return (
    <span
      className={className ? `avatar ${className}` : 'avatar'}
      style={{ background: colorFor(id ?? name) }}
      title={name}
    >
      {initials(name)}
    </span>
  )
}

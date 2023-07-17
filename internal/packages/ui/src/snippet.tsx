import { type HTMLAttributes } from 'react'
import clsx from 'clsx'

export const Snippet = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLPreElement>) => (
  <pre
    className={clsx(
      'border border-accents-2 rounded-md bg-accents-1 overflow-x-auto p-6',
      className
    )}
    {...props}
  >
    {children}
  </pre>
)

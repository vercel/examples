import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export const Code = ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
  <code
    className={clsx(
      'text-code text-base whitespace-pre-wrap before:content-["`"] after:content-["`"]',
      className
    )}
    {...props}
  />
)

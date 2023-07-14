import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export const Page = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) => (
  <main
    {...props}
    className={clsx('w-full max-w-3xl mx-auto py-16', className)}
  >
    {children}
  </main>
)

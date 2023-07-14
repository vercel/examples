import type { FC, HTMLAttributes } from 'react'
import cn from 'clsx'

export * from './layout.js'
export * from './head.js'
export * from './text.js'
export * from './input.js'
export * from './button.js'
export * from './loading-dots.js'
export * from './link.js'
export * from './code.js'
export { default as List } from './list.js'
export { default as Snippet } from './snippet.js'

export const Page: FC<HTMLAttributes<HTMLElement>> = ({
  children,
  className,
  ...props
}) => (
  <main {...props} className={cn('w-full max-w-3xl mx-auto py-16', className)}>
    {children}
  </main>
)

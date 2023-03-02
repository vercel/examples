import type { FC, ReactNode, ComponentType, HTMLAttributes } from 'react'
import cn from 'clsx'

export { default as Layout } from './layout.js'
export { default as Text } from './text.js'
export { default as Input } from './input.js'
export { default as Button } from './button.js'
export { default as LoadingDots } from './loading-dots.js'
export { default as Link, A } from './link.js'
export { default as Code } from './code.js'
export { default as List } from './list.js'
export { default as Snippet } from './snippet.js'

const Noop: FC<{ children?: ReactNode }> = ({ children }) => <>{children}</>

export const Page: FC<HTMLAttributes<HTMLElement>> = ({
  children,
  className,
  ...props
}) => (
  <main {...props} className={cn('w-full max-w-3xl mx-auto py-16', className)}>
    {children}
  </main>
)

export function getLayout<LP extends {}>(
  Component: ComponentType<any>
): ComponentType<LP> {
  return (Component as any).Layout || Noop
}

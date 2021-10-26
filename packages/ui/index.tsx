import type { FC, ComponentType, HTMLAttributes } from 'react'
import cn from 'clsx'

export { default as Layout } from './layout'
export { default as Text } from './text'
export { default as Input } from './input'
export { default as Button } from './button'
export { default as LoadingDots } from './loading-dots'
export { default as Link } from './link'
export { default as Code } from './code'
export { default as List } from './list'

const Noop: FC = ({ children }) => <>{children}</>

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

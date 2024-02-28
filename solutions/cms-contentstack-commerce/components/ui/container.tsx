import type { FunctionComponent, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface Props {
  className?: string
  children?: any
  el?: string
  clean?: boolean
}

export const Container = ({
  children,
  className,
  el = 'div',
  clean,
}: Props) => {
  let Component: FunctionComponent<HTMLAttributes<HTMLDivElement>> = el as any
  return (
    <Component className={clsx(className, !clean && 'mx-auto max-w-8xl')}>
      {children}
    </Component>
  )
}

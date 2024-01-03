import type { CSSProperties, ReactNode, ComponentType } from 'react'
import clsx from 'clsx'

interface Props {
  variant?: Variant
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

type Variant = 'ul' | 'ol'

export const List = ({
  style,
  className = '',
  variant = 'ul',
  children,
}: Props) => {
  const componentsMap: {
    [P in Variant]: ComponentType<any> | string
  } = {
    ul: 'ul',
    ol: 'ol',
  }
  const Component: ComponentType<any> | string = componentsMap[variant]

  return (
    <Component
      className={clsx(
        'pl-6 [&_li]:before:content-["-"] [&_li]:before:absolute [&_li]:before:text-accents-3 [&_li]:before:-ml-4',
        className
      )}
      style={style}
    >
      {children}
    </Component>
  )
}

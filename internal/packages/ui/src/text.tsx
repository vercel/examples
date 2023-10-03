import type { CSSProperties, ReactNode, ComponentType } from 'react'
import clsx from 'clsx'

interface Props {
  variant?: Variant
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

type Variant = 'h1' | 'h2' | 'description' | 'body' | 'smallText'

const variants: Record<Variant, string> = {
  h1: 'text-5xl font-bold tracking-tight',
  h2: 'text-4xl font-semibold tracking-tight',
  description: 'text-lg font-medium tracking-tight text-accents-5',
  body: 'text-base font-normal',
  smallText:
    'text-sm font-semibold text-blue uppercase tracking-tight pl-1 block',
}

export const Text = ({
  style,
  className = '',
  variant = 'body',
  children,
}: Props) => {
  const componentsMap: {
    [P in Variant]: ComponentType<any> | string
  } = {
    h1: 'h1',
    h2: 'h2',
    body: 'p',
    description: 'p',
    smallText: 'small',
  }
  const Component: ComponentType<any> | string = componentsMap[variant]

  return (
    <Component className={clsx(variants[variant], className)} style={style}>
      {children}
    </Component>
  )
}

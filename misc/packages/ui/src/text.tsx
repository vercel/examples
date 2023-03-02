import React from 'react'
import cn from 'clsx'

interface Props {
  variant?: Variant
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode | any
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

const Text: React.FC<Props> = ({
  style,
  className = '',
  variant = 'body',
  children,
}) => {
  const componentsMap: {
    [P in Variant]: React.ComponentType<any> | string
  } = {
    h1: 'h1',
    h2: 'h2',
    body: 'p',
    description: 'p',
    smallText: 'small',
  }

  const Component:
    | React.JSXElementConstructor<any>
    | React.ReactElement<any>
    | React.ComponentType<any>
    | string = componentsMap[variant]

  return (
    <Component className={cn('', variants[variant], className)} style={style}>
      {children}
    </Component>
  )
}

export default Text

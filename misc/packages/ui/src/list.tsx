import React from 'react'
import cn from 'clsx'

interface Props {
  variant?: Variant
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode | any
}

type Variant = 'ul' | 'ol'

const List: React.FC<Props> = ({
  style,
  className = '',
  variant = 'ul',
  children,
}) => {
  const componentsMap: {
    [P in Variant]: React.ComponentType<any> | string
  } = {
    ul: 'ul',
    ol: 'ol',
  }

  const Component:
    | React.JSXElementConstructor<any>
    | React.ReactElement<any>
    | React.ComponentType<any>
    | string = componentsMap[variant]

  return (
    <Component
      className={cn(
        'pl-6 [&_li]:before:content-["-"] [&_li]:before:absolute [&_li]:before:text-accents-3 [&_li]:before:-ml-4',
        className
      )}
      style={style}
    >
      {children}
    </Component>
  )
}

export default List

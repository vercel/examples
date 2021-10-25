import React, {
  FunctionComponent,
  JSXElementConstructor,
  CSSProperties,
} from 'react'
import cn from 'clsx'
import s from './list.module.css'

interface Props {
  variant?: Variant
  className?: string
  style?: CSSProperties
  children?: React.ReactNode | any
  html?: string
}

type Variant = 'ul' | 'ol'

const List: FunctionComponent<Props> = ({
  style,
  className = '',
  variant = 'ul',
  children,
  html,
}) => {
  const componentsMap: {
    [P in Variant]: React.ComponentType<any> | string
  } = {
    ul: 'ul',
    ol: 'ol',
  }

  const Component:
    | JSXElementConstructor<any>
    | React.ReactElement<any>
    | React.ComponentType<any>
    | string = componentsMap[variant]
  const htmlContentProps = html
    ? { dangerouslySetInnerHTML: { __html: html } }
    : {}

  return (
    <Component
      className={cn(s.root, [s[`${variant}`]], className)}
      style={style}
      {...htmlContentProps}
    >
      {children}
    </Component>
  )
}

export default List

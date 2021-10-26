import React, {
  FunctionComponent,
  JSXElementConstructor,
  CSSProperties,
} from 'react'
import cn from 'clsx'
import s from './text.module.css'

interface Props {
  variant?: Variant
  className?: string
  style?: CSSProperties
  children?: React.ReactNode | any
  html?: string
}

type Variant = 'h1' | 'h2' | 'description' | 'body' | 'smallText'

const Text: FunctionComponent<Props> = ({
  style,
  className = '',
  variant = 'body',
  children,
  html,
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
    | JSXElementConstructor<any>
    | React.ReactElement<any>
    | React.ComponentType<any>
    | string = componentsMap[variant]

  const htmlContentProps = html
    ? {
        dangerouslySetInnerHTML: { __html: html },
      }
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

export default Text

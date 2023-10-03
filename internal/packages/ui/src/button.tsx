import type {
  ButtonHTMLAttributes,
  JSXElementConstructor,
  AnchorHTMLAttributes,
} from 'react'
import clsx from 'clsx'
import { LoadingDots } from './loading-dots.js'

/**
 * All the component types allowed by the Button component.
 */
export type ButtonComponentType = 'button' | 'a' | JSXElementConstructor<any>

/**
 * Base props of the Button component.
 */
export interface ButtonProps<C extends ButtonComponentType = 'button'> {
  href?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'violet' | 'black' | 'white'
  size?: 'sm' | 'md' | 'lg'
  active?: boolean
  type?: 'submit' | 'reset' | 'button'
  Component?: C
  width?: string | number
  loading?: boolean
  disabled?: boolean
}

/**
 * The HTML props allowed by the Button component. These
 * props depend on the used component type (C).
 */
export type ButtonHTMLType<C extends ButtonComponentType = 'button'> =
  C extends 'a'
    ? AnchorHTMLAttributes<HTMLAnchorElement>
    : ButtonHTMLAttributes<HTMLButtonElement>

const variants = {
  primary:
    'text-background bg-success border-success-dark hover:bg-success/90 shadow-[0_5px_10px_rgb(0,68,255,0.12)]',
  ghost: 'text-success hover:bg-[rgba(0,68,255,0.06)]',
  secondary:
    'text-accents-5 bg-background border-accents-2 hover:border-foreground hover:text-foreground',
  black:
    'bg-foreground text-background border-foreground hover:bg-background hover:text-foreground',
  white: 'bg-background text-foreground border-background hover:bg-accents-1',
  violet: 'text-background bg-violet border-violet-dark hover:bg-[#7123be]',
}

const sizes = {
  sm: 'h-8 leading-3 text-sm px-1.5 py-3',
  md: 'h-10 leading-10 text-[15px]',
  lg: 'h-12 leading-12 text-[17px]',
}

// Our Button component is built thinking of it as a button,
// but it can also be used as a link and include the anchor props
export const Button = <C extends ButtonComponentType = 'button'>(
  props: ButtonHTMLType<C> & ButtonProps<C>
) => {
  const {
    width,
    active,
    children,
    variant = 'primary',
    Component = 'button',
    loading = false,
    style = {},
    size = 'md',
    className,
    ...rest
  } = props

  const Compt: any = Component
  const rootClassName = clsx(
    'relative inline-flex items-center justify-center cursor pointer no-underline px-3.5 rounded-md',
    'font-medium outline-0 select-none align-middle whitespace-nowrap',
    'transition-colors ease-in duration-200',
    variant !== 'ghost' && 'border border-solid',
    variants[variant],
    sizes[size],
    { 'cursor-not-allowed': loading },
    className
  )

  return (
    <Compt
      aria-pressed={active}
      data-variant={variant}
      className={rootClassName}
      style={{
        width,
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <i className="m-0 flex">
          <LoadingDots />
        </i>
      ) : (
        children
      )}
    </Compt>
  )
}

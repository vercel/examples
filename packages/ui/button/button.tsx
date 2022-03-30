import {
  FC,
  ButtonHTMLAttributes,
  JSXElementConstructor,
  AnchorHTMLAttributes,
} from 'react'
import cn from 'clsx'
import LoadingDots from '../loading-dots'
import s from './button.module.css'

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
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'ghost'
    | 'violet'
    | 'black'
    | 'white'
  size?: 'xs' | 'sm' | 'md' | 'lg'
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

type ButtonFC<C extends ButtonComponentType = 'button'> = FC<
  ButtonHTMLType<C> & ButtonProps<C>
>

type ButtonType = <C extends ButtonComponentType = 'button'>(
  ...args: Parameters<ButtonFC<C>>
) => ReturnType<ButtonFC<C>>

const Button: ButtonFC = (props) => {
  const {
    width,
    active,
    children,
    variant = 'primary',
    Component = 'button',
    disabled = false,
    loading = false,
    style = {},
    size = 'md',
    className,
    ...rest
  } = props

  const rootClassName = cn(
    s.root,
    [s[`${variant}`]],
    [s[`${size}`]],
    {
      [s.disabled]: disabled,
    },
    className
  )

  return (
    <Component
      aria-pressed={active}
      data-variant={variant}
      className={rootClassName}
      disabled={disabled}
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
    </Component>
  )
}

// Our Button component is built thinking of it as a button,
// but it can also be used as a link and include the anchor props
export default Button as ButtonType

import React, { ButtonHTMLAttributes, JSXElementConstructor } from 'react'
import cn from 'clsx'
import LoadingDots from '../loading-dots'
import s from './button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
  Component?: string | JSXElementConstructor<any>
  width?: string | number
  loading?: boolean
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = (props) => {
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

export default Button

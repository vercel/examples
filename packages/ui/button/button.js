import React from 'react'
import cn from 'clsx'
import LoadingDots from '../loading-dots'
import s from './button.module.css'

const Button = (props, buttonRef) => {
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
        <i className="pl-2 m-0 flex">
          <LoadingDots />
        </i>
      ) : (
        children
      )}
    </Component>
  )
}

export default Button

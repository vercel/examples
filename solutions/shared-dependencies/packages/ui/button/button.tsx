import type { FC, ButtonHTMLAttributes } from 'react'
import cn from 'clsx'
import s from './button.module.css'

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  const rootClassName = cn(s.root, className)

  return (
    <button className={rootClassName} {...props}>
      {children}
    </button>
  )
}

export default Button

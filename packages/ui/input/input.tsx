import React, { InputHTMLAttributes } from 'react'
import cn from 'clsx'
import s from './input.module.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input: React.FC<InputProps> = (props) => {
  const { children, className, ...rest } = props

  const rootClassName = cn(s.root, className)

  return (
    <input className={rootClassName} {...rest}>
      {children}
    </input>
  )
}

export default Input

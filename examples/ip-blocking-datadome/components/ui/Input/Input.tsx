import cn from 'classnames'
import s from './Input.module.css'
import React, { InputHTMLAttributes } from 'react'

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

import React, { InputHTMLAttributes } from 'react'
import cn from 'clsx'
import s from './input.module.css'

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  children,
  className,
  ...rest
}) => (
  <input className={cn(s.root, className)} {...rest}>
    {children}
  </input>
)

export default Input

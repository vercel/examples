import { InputHTMLAttributes } from 'react'
import cn from 'clsx'

export const Input = ({
  children,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'px-3 py-1 transition-colors duration-200 bg-background block font-sans text-sm leading-7 w-full text-foreground caret-foreground',
      'rounded-md border border-solid border-accents-2 outline-0 box-border text-ellipsis appearance-none',
      'focus:border-accents-5 active:border-accents-5',
      className
    )}
    {...rest}
  >
    {children}
  </input>
)

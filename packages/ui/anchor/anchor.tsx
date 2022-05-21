import type { AnchorHTMLAttributes, FC } from 'react'
import cn from 'clsx'
import s from './anchor.module.css'

const A: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  children,
  className,
  ...props
}) => (
  <a className={cn(s.root, className)} {...props}>
    {children}
  </a>
)

export default A

import type { AnchorHTMLAttributes, FC } from 'react'
import NextLink, { LinkProps } from 'next/link'
import cn from 'clsx'
import s from './link.module.css'

const Link: FC<LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href,
  prefetch,
  className,
  ...props
}) => (
  <NextLink href={href} prefetch={prefetch}>
    <a className={cn(s.root, className)} {...props}></a>
  </NextLink>
)

export default Link

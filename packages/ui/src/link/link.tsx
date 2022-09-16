import type { AnchorHTMLAttributes, FC } from 'react'
import NextLink, { LinkProps } from 'next/link'
import cn from 'clsx'
import s from '../anchor/anchor.module.css'

const Link: FC<
  Exclude<LinkProps, 'passHref'> & AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ href, prefetch, children, className, ...props }) => (
  <NextLink href={href} prefetch={prefetch}>
    <a className={cn(s.root, className)} {...props}>
      {children}
    </a>
  </NextLink>
)

export default Link

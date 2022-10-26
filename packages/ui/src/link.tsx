import type { AnchorHTMLAttributes, FC } from 'react'
import NextLink, { LinkProps } from 'next/link.js'
import cn from 'clsx'

const Link: FC<
  Exclude<LinkProps, 'passHref'> & AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ href, prefetch, children, className, ...props }) => (
  <NextLink
    href={href}
    prefetch={prefetch}
    className={cn(
      'text-link hover:text-link-light transition-colors no-underline',
      // CSS for <code/>
      '[&_code]:text-link [&_code]:hover:text-link-light [&_code]:transition-colors',
      className
    )}
    {...props}
  >
    {children}
  </NextLink>
)

export default Link

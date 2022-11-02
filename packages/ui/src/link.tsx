import type { FC } from 'react'
import NextLink, { LinkProps } from 'next/link.js'
import cn from 'clsx'

// TODO: replace this with `LinkProps` once it's including the anchor props
type LinkPropsReal = React.PropsWithChildren<
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps
>

const css = [
  'text-link hover:text-link-light transition-colors no-underline',
  // CSS for <code/>
  '[&_code]:text-link [&_code]:hover:text-link-light [&_code]:transition-colors',
]

const Link: FC<LinkPropsReal> = ({ children, className, href, ...props }) => (
  <NextLink href={href} legacyBehavior>
    <a className={cn(css, className)} {...props}>
      {children}
    </a>
  </NextLink>
)

// A normal anchor tag is also exported for relative links to paths that don't exist in the app.
// For example apps that are using Multi Zones.
export const A: FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  children,
  className,
  ...props
}) => (
  <a className={cn(css, className)} {...props}>
    {children}
  </a>
)

export default Link

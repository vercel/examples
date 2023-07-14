import NextLink, { LinkProps as NextLinkProps } from 'next/link.js'
import clsx from 'clsx'

type LinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof NextLinkProps
> &
  NextLinkProps & {
    secondary?: boolean
  }

const css = 'transition-colors no-underline'
const primaryCss = [
  'text-link hover:text-link-light',
  // CSS for <code/>
  '[&_code]:text-link [&_code]:hover:text-link-light [&_code]:transition-colors',
]
const secondaryCss = 'text-accents-6 duration-200 hover:text-accents-8'

export const Link = ({
  children,
  className,
  href,
  secondary,
  ...props
}: LinkProps) => (
  <NextLink
    href={href}
    className={clsx(css, secondary ? secondaryCss : primaryCss, className)}
    {...props}
  >
    {children}
  </NextLink>
)

// A normal anchor tag is also exported for relative links to paths that don't exist in the app.
// For example apps that are using Multi Zones.
export const A = ({
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className={clsx(css, className)} {...props}>
    {children}
  </a>
)

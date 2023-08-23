import NextLinkComp, { LinkProps as NextLinkProps } from 'next/link.js'
import clsx from 'clsx'

const NextLink: typeof NextLinkComp =
  (NextLinkComp as any).default || NextLinkComp

type LinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof NextLinkProps
> &
  NextLinkProps & {
    component?: 'a' | 'Link'
    secondary?: boolean
  }

export const Link = ({
  children,
  className,
  href,
  component,
  secondary,
  ...props
}: LinkProps) => {
  // A normal anchor tag is also supported for relative links to paths that don't exist in the app.
  // For example apps that are using Multi Zones.
  const Component: any = component === 'a' ? 'a' : NextLink

  return (
    <Component
      href={href}
      className={clsx(
        'transition-colors no-underline',
        secondary
          ? 'text-accents-6 duration-200 hover:text-accents-8'
          : [
              'text-link hover:text-link-light',
              // CSS for <code/>
              '[&_code]:text-link [&_code]:hover:text-link-light [&_code]:transition-colors',
            ],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export const A = ({
  href,
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <Link href={href!} component="a" {...props}>
    {children}
  </Link>
)

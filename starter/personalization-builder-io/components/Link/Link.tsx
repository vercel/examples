import NextLink from 'next/link'

export const Link = ({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <NextLink href={href!} {...props}>
      {children}
    </NextLink>
  )
}

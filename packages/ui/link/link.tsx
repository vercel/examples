import type { AnchorHTMLAttributes, FC } from 'react'
import NextLink, { LinkProps } from 'next/link'
import cn from 'clsx'
import s from './link.module.css'
import { useTheme } from 'next-themes'

const Link: FC<LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href,
  prefetch,
  className,
  ...props
}) => {
  const { theme, forcedTheme } = useTheme()
  const darkMode = forcedTheme === 'dark' || theme === 'dark'
  return (
    <NextLink href={href} prefetch={prefetch}>
      <a
        className={cn(darkMode ? s['root-dark'] : s.root, className)}
        {...props}
      ></a>
    </NextLink>
  )
}

export default Link

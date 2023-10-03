import type { FC, ButtonHTMLAttributes } from 'react'
import cn from 'clsx'

const Quote: FC<ButtonHTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => {
  // All of these tailwind classes are watched by `tailwind.config.js` in the Next.js app
  const rootClassName = cn(
    'border-l-4 pl-4',
    'font-normal leading-6 text-base',
    className
  )

  return (
    <p className={rootClassName} {...props}>
      {children}
    </p>
  )
}

export default Quote

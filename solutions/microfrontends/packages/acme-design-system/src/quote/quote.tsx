import type { FC, ButtonHTMLAttributes } from 'react'
import cn from 'clsx'
import styles from './quote.module.css'

const Quote: FC<ButtonHTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => {
  // All of these tailwind classes are watched by `tailwind.config.js` in the Next.js app
  const rootClassName = cn(styles.root, styles.text, className)

  return (
    <p className={rootClassName} {...props}>
      {children}
    </p>
  )
}

export default Quote

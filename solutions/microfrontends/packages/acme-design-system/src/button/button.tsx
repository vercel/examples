import type { FC, ButtonHTMLAttributes } from 'react'
import cn from 'clsx'

export interface ButtonProps {
  /**
   * This is a description
   */
  secondary?: boolean
}

const Button: FC<ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  secondary = false,
  ...props
}) => {
  // All of these tailwind classes are watched by `tailwind.config.js` in the Next.js app
  const rootClassName = cn(
    'relative inline-flex items-center justify-center cursor-pointer',
    'no-underline py-0 px-3.5 rounded-md border border-solid border-black',
    'text-base font-medium outline-none select-none align-middle',
    'whitespace-nowrap leading-10 shadow-md transition-colors',
    secondary ? 'bg-white text-black' : 'bg-black text-white',
    className
  )

  return (
    <button className={rootClassName} {...props}>
      {children}
    </button>
  )
}

export default Button

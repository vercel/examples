import { FC, HTMLAttributes } from 'react'
import cn from 'clsx'
// import s from './code.module.css'
// import anchorStyles from '../anchor/anchor.module.css'

const Code: FC<HTMLAttributes<HTMLElement>> = ({ className, ...props }) => (
  <code
    className={cn(
      'text-code text-base whitespace-pre-wrap before:content-["`"] after:content-["`"]',
      className
    )}
    {...props}
  />
)

export default Code

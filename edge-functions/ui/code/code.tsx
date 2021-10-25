import { FC, HTMLAttributes } from 'react'
import cn from 'clsx'
import s from './code.module.css'
import linkStyles from '../link/link.module.css'

const Code: FC<HTMLAttributes<HTMLElement>> = ({ className, ...props }) => (
  <code className={cn(s.root, linkStyles.inlineCode, className)} {...props} />
)

export default Code

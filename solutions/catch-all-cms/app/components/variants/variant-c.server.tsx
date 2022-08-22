import type { FC, ReactNode } from 'react'
import styles from '../styles.module.css'
import cn from 'clsx'

const VariantC: FC<{ children: ReactNode }> = ({ children }) => (
  <div className={cn(styles.root, styles['variant-c'])}>{children}</div>
)

export default VariantC

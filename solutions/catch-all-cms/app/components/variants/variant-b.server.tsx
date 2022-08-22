import type { FC, ReactNode } from 'react'
import cn from 'clsx'
import styles from '../styles.module.css'

const VariantB: FC<{ children: ReactNode }> = ({ children }) => (
  <div className={cn(styles.root, styles['variant-b'])}>{children}</div>
)

export default VariantB

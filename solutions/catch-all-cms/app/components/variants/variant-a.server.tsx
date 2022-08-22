import type { FC, ReactNode } from 'react'
import styles from '../styles.module.css'

const VariantA: FC<{ children: ReactNode }> = ({ children }) => (
  <div className={styles.root}>{children}</div>
)

export default VariantA

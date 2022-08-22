import type { FC } from 'react'
import cn from 'clsx'
import styles from './styles.module.css'

const VariantB: FC = () => (
  <div className={cn(styles.root, styles['variant-b'])}>Variant B</div>
)

export default VariantB

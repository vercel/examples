import type { FC } from 'react'
import styles from './styles.module.css'
import cn from 'clsx'

const VariantC: FC = () => (
  <div className={cn(styles.root, styles['variant-c'])}>Variant C</div>
)

export default VariantC

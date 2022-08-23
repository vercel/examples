import type { FC, ReactNode } from 'react'
import Categories, { Category } from '../categories.server'
import cn from 'clsx'
import styles from '../styles.module.css'

type Props = {
  children: ReactNode
  categories: Category[]
}

const VariantB: FC<Props> = ({ children, categories }) => (
  <div className={cn(styles.root, styles['variant-b'])}>
    <span className="mr-6">{children}</span>
    <Categories categories={categories} />
  </div>
)

export default VariantB

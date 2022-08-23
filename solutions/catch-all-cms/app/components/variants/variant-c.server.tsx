import type { FC, ReactNode } from 'react'
import Categories, { Category } from '../categories.server'
import styles from '../styles.module.css'
import cn from 'clsx'

type Props = {
  children: ReactNode
  categories: Category[]
}

const VariantC: FC<Props> = ({ children, categories }) => (
  <div className={cn(styles.root, styles['variant-c'])}>
    <span className="mr-6">{children}</span>
    <Categories categories={categories} />
  </div>
)

export default VariantC

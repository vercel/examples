import type { FC, ReactNode } from 'react'
import cn from 'clsx'
import Categories, { Category } from '../categories'
import styles from '../styles.module.css'

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

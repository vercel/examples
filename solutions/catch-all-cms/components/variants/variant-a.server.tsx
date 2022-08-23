import type { FC, ReactNode } from 'react'
import Categories, { Category } from '../categories.server'
import styles from '../styles.module.css'

type Props = {
  children: ReactNode
  categories: Category[]
}

const VariantA: FC<Props> = ({ children, categories }) => (
  <div className={styles.root}>
    <span className="mr-6">{children}</span>
    <Categories categories={categories} />
  </div>
)

export default VariantA

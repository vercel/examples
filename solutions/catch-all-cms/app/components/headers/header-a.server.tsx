import cn from 'clsx'
import Categories, { Category } from '../categories.server'
import styles from '../styles.module.css'

type Props = { title: string; categories: Category[] }

const HeaderA: React.FC<Props> = ({ title, categories }) => (
  <nav className={cn(styles.root, styles['header-a'])}>
    <span className="mr-6">{title}</span>
    <Categories categories={categories} />
  </nav>
)

export default HeaderA

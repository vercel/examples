import { Link } from '@vercel/examples-ui'
import cn from 'clsx'
import styles from '../styles.module.css'

const HeaderA: React.FC<{ categories: string[] }> = ({ categories }) => (
  <nav className={cn(styles.root, styles['header-a'])}>
    <span className="mr-6">Header A</span>
    <ul className="flex">
      <li className="mr-4">
        <Link href="/header-a/a/b/c">header-a/a/b/c</Link>
      </li>
      <li className="mr-4">
        <Link href="/header-a/b/a/c">header-a/b/a/c</Link>
      </li>
      <li className="mr-4">
        <Link href="/header-a/b/a/c">header-a/b/a/c</Link>
      </li>
    </ul>
  </nav>
)

export default HeaderA

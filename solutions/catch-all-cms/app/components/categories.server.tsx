import { Link } from '@vercel/examples-ui'

export type Category = {
  text: string
  href: string
}

type Props = { categories: Category[] }

const Categories: React.FC<Props> = ({ categories }) => (
  <ul className="flex">
    {categories.map((category) => (
      <li key={category.href} className="mr-4">
        <Link href={category.href}>{category.text}</Link>
      </li>
    ))}
  </ul>
)

export default Categories

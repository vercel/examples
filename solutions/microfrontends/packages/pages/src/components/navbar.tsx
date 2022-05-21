import type { VFC } from 'react'
import { Link } from '@vercel/examples-ui'

const Navbar: VFC = () => (
  <ul className="inline-flex mb-4">
    <li>
      <Link href="/">Home</Link>
    </li>
    <li className="ml-4">
      <Link href="/about">About</Link>
    </li>
    <li className="ml-4">
      <Link href="/docs">Docs (Multi Zones)</Link>
    </li>
  </ul>
)

export default Navbar

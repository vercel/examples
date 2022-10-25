import type { FC } from 'react'
import { Link } from '@vercel/examples-ui'

const Navbar: FC<{ isDocsApp?: boolean }> = ({ isDocsApp }) =>
  isDocsApp ? (
    <ul className="inline-flex mb-4">
      <li>
        <a
          href="/"
          className="text-link hover:text-link-light transition-colors no-underline"
        >
          Home (Multi Zones)
        </a>
      </li>
      <li className="ml-4">
        <Link href="/">Docs</Link>
      </li>
      <li className="ml-4">
        <Link href="/about">About Docs</Link>
      </li>
    </ul>
  ) : (
    <ul className="inline-flex mb-4">
      <li>
        <Link href="/">Home</Link>
      </li>
      <li className="ml-4">
        <Link href="/about">About</Link>
      </li>
      <li className="ml-4">
        <a
          href="/docs"
          className="text-link hover:text-link-light transition-colors no-underline"
        >
          Docs (Multi Zones)
        </a>
      </li>
    </ul>
  )

export default Navbar

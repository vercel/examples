import { Link, A } from '@vercel/examples-ui'

export function Navbar({ isDocsApp }: { isDocsApp?: boolean }) {
  return isDocsApp ? (
    <ul className="inline-flex mb-4">
      <li>
        <A href="/">Home (Multi-Zones)</A>
      </li>
      <li className="ml-4">
        <Link href="/docs">Docs</Link>
      </li>
      <li className="ml-4">
        <Link href="/docs/about">About Docs</Link>
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
        <A href="/docs">Docs (Multi-Zones)</A>
      </li>
    </ul>
  )
}

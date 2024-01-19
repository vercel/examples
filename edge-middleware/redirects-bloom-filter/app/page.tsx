import { List, Link, Text } from '@vercel/examples-ui'

const redirectingLinks = [
  {
    href: '/blog/should-redirect-to-google',
    text: 'Redirect to Google',
  },
  {
    href: '/blog/should-redirect-to-yahoo',
    text: 'Redirect to Yahoo',
  },
  {
    href: '/blog/should-redirect-to-1',
    text: 'Redirect to Google with query string 1',
  },
  {
    href: '/blog/should-redirect-to-1000',
    text: 'Redirect to Google with query string 1000',
  },
  {
    href: '/blog/should-redirect-to-9999',
    text: 'Redirect to Google with query string 9999',
  },
]

const regularLinks = [
  {
    href: '/blog/should-render-basic-blog-post',
    text: 'Render basic blog post',
  },
]

export default function Page() {
  return (
    <>
      <h1 className="text-3xl font-bold">Redirects with Bloom Filter</h1>
      <Text className="mt-4">
        This example shows how you can use a{' '}
        <Link href="https://en.wikipedia.org/wiki/Bloom_filter">
          Bloom Filter
        </Link>{' '}
        and{' '}
        <Link href="https://nextjs.org/docs/app/building-your-application/routing/redirecting#managing-redirects-at-scale-advanced">
          Edge Middleware{' '}
        </Link>{' '}
        to improve the lookup performance of a large list of redirects (50,000).
      </Text>
      <Text className="mt-4">
        Although this example stores the redirects in a JSON file, you can also
        use a database such as{' '}
        <Link href="https://vercel.com/docs/storage/edge-config/get-started">
          Edge Config
        </Link>{' '}
        or <Link href="https://vercel.com/docs/storage/vercel-kv">Redis</Link>.
      </Text>
      <Text className="mt-4">
        Before using this example, you should measure which is more performant:
        1. Directly querying your data or 2. Using a Bloom Filter to check if
        the redirect exists before querying the data.
      </Text>
      <Text className="mt-4">
        Learn more by reading the{' '}
        <Link href="https://nextjs.org/docs/app/building-your-application/routing/redirecting#managing-redirects-at-scale-advanced">
          documentation
        </Link>
        .
      </Text>
      <section className="mt-4">
        <h2 className="text-xl font-bold my-4">Redirecting links</h2>
        <LinkList links={redirectingLinks} />
      </section>
      <section>
        <h2 className="text-xl font-bold my-4">Regular Links</h2>
        <LinkList links={regularLinks} />
      </section>
    </>
  )
}

function LinkList({ links }: { links: { href: string; text: string }[] }) {
  return (
    <List>
      {links.map(({ href, text }) => (
        <div key={href}>
          <li>
            <Link href={href}>{text} (Soft Navigation)</Link>
          </li>
          <li>
            <a
              href={href}
              target="_blank"
              className="transition-colors no-underline text-link hover:text-link-light [&_code]:text-link [&_code]:hover:text-link-light [&_code]:transition-colors"
            >
              {text} (New window)
            </a>
          </li>
        </div>
      ))}
    </List>
  )
}

import { Page, Text, Link as UILink } from '@vercel/examples-ui'
import { DEMO_SITES } from '@/lib/demo'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">A multi-tenant blog platform, powered by Neon</Text>
        <Text>
          Sign up, create a site, and it gets its own subdomain (
          <code>your-site.example.com</code>) serving a public blog. The entire
          backend is <UILink href="https://neon.com">Neon</UILink>: serverless
          Postgres for data,{' '}
          <UILink href="https://neon.com/docs/auth/overview">Neon Auth</UILink>{' '}
          for sign-in, the{' '}
          <UILink href="https://neon.com/docs/data-api/overview">
            Data API
          </UILink>{' '}
          for the dashboard, and{' '}
          <UILink href="https://neon.com/docs/storage/overview">
            Neon Object Storage
          </UILink>{' '}
          for cover images.
        </Text>
      </section>
      <section className="flex flex-col gap-4">
        <Text variant="h2">Public demo blogs</Text>
        <Text className="text-gray-500">
          No login needed. Each site is a tenant on its own subdomain.
        </Text>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {DEMO_SITES.map((site) => (
            <a
              key={site.subdomain}
              href={`http://${site.subdomain}.${ROOT_DOMAIN}`}
              target="_blank"
              rel="noreferrer"
              className="border border-gray-200 rounded-md overflow-hidden flex flex-col hover:border-gray-400"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.cover}
                alt={site.coverAlt}
                className="h-36 w-full object-cover"
              />
              <div className="flex flex-col gap-2 p-4 min-w-0">
                <Text className="font-semibold">{site.name}</Text>
                <Text className="text-sm text-gray-500">
                  {site.description}
                </Text>
                <span className="text-sm text-gray-400">
                  {site.subdomain}.{ROOT_DOMAIN} ↗
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <Text variant="h2">How the pieces fit</Text>
        <Text>
          The signed-in dashboard talks to the{' '}
          <UILink href="https://neon.com/docs/data-api/overview">
            Data API
          </UILink>{' '}
          with a{' '}
          <UILink href="https://neon.com/docs/auth/overview">Neon Auth</UILink>{' '}
          JWT, and Row-Level Security keeps each user{"'"}s sites and posts
          private to them. The server renders public tenant blogs with the{' '}
          <strong>serverless driver</strong>, so every subdomain is fast and
          SEO-friendly. Cover images live in{' '}
          <UILink href="https://neon.com/docs/storage/overview">
            Neon Object Storage
          </UILink>
          .
        </Text>
      </section>
      <section className="flex flex-col gap-3">
        <Text variant="h2">Preview deployments get their own branch</Text>
        <Text>
          With the Neon integration on Vercel, each preview deployment connects
          to an isolated Neon branch, a full copy of the database and its auth,
          so every pull request gets a real backend to test against.
        </Text>
      </section>
      <section className="flex flex-col gap-3">
        <Text variant="h2">Try it</Text>
        <Text>
          <UILink href="/login">Sign in</UILink> or{' '}
          <UILink href="/login">create an account</UILink>, add a site, write a
          post, and publish it to see it live on the site{"'"}s subdomain.
        </Text>
      </section>
    </Page>
  )
}

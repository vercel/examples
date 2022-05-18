import { signIn, signOut, useSession } from 'next-auth/react'
import {
  Button,
  Layout,
  Link,
  Page,
  Text,
  List,
  Code,
} from '@vercel/examples-ui'

export default function Home() {
  const { data, status } = useSession()

  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">Securing routes using next-auth</Text>
        <Text>
          Wrapping our <Code>pages/_app</Code> using{' '}
          <Code>SessionProvider</Code> from <Code>next-auth</Code> will secure
          all our pages. If we configure sub domains or rewrites, all will be
          behind an auth wall.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        {status === 'authenticated' ? (
          <section className="flex flex-col gap-3">
            Welcome {data?.user?.name}!{' '}
            <Button onClick={() => signOut()}>Sign out</Button>
            <List>
              <li>
                <Link href="https://subdomain.solutions-subdomain-auth.vercel.sh">
                  subdomain.solutions-subdomain-auth.vercel.sh
                </Link>
              </li>
              <li>
                <Link href="https://solutions-subdomain-auth.vercel.sh">
                  solutions-subdomain-auth.vercel.sh
                </Link>
              </li>
            </List>
          </section>
        ) : status === 'loading' ? (
          <section className="text-center">
            <Text>Loading...</Text>
          </section>
        ) : (
          <section className="m-auto w-fit">
            <Button size="lg" onClick={() => signIn('github')}>
              Sign in with GitHub
            </Button>
          </section>
        )}
      </section>
    </Page>
  )
}

Home.Layout = Layout

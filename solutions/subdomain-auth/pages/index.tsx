import { signIn, signOut, useSession } from 'next-auth/react'
import { Button, Layout, Link, Page, Text, List } from '@vercel/examples-ui'

export default function Home() {
  const { data, status } = useSession()

  return (
    <Page>
      {status === 'authenticated' ? (
        <div>
          Welcome {data?.user?.name}!{' '}
          <Button
            onClick={() => signOut()}
          >
            Sign out
          </Button>
          <List>
            <li>
              <Link href="https://sub1.subdomain-auth.com">
                sub1.subdomain-auth.com
              </Link>
            </li>
            <li>
              <a href="https://subdomain-auth.com">subdomain-auth.com</a>
            </li>
          </List>
        </div>
      ) : status === "loading" ? (
        <Text>Loading...</Text>
      ) : (
        <div className='m-auto w-fit-content'>
          <Button size="lg" onClick={() => signIn('github')}>
            Sign in with GitHub
          </Button>
        </div>
      )}
    </Page>
  )
}

Home.Layout = Layout

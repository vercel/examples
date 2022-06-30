import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Layout, Page, Text, Button } from '@vercel/examples-ui'

export default function Beta() {
  const router = useRouter()

  const optOut = () => {
    Cookies.set('beta', 'false')
    router.reload()
  }

  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Cookies example
      </Text>
      <Text className="mb-4">You are currently in beta!</Text>
      <Button variant="secondary" onClick={optOut}>
        Opt out
      </Button>
    </Page>
  )
}

Beta.Layout = Layout

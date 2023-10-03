import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Layout, Page, Text, Button } from '@vercel/examples-ui'

export default function NonBeta() {
  const router = useRouter()

  const optIn = () => {
    Cookies.set('beta', 'true')
    router.reload()
  }

  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Cookies example
      </Text>
      <Text className="mb-4">You are currently not in beta!</Text>
      <Button variant="secondary" onClick={optIn}>
        Opt in
      </Button>
    </Page>
  )
}

NonBeta.Layout = Layout

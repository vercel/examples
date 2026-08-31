import { abby } from '@lib/abby'
import { Button, Layout, Page, Text } from '@vercel/examples-ui'
import { useRouter } from 'next/router'

export default function Marketing() {
  const router = useRouter()
  const removeBucket = () => {
    const resetVariant = abby.getABResetFunction('Marketing')
    resetVariant()
    router.reload()
  }

  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Marketing page
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently on <b>/marketing/original</b>
      </Text>
      <Text className="mb-4">This is the original marketing page</Text>
      <Button variant="black" onClick={removeBucket}>
        Remove bucket
      </Button>
    </Page>
  )
}

Marketing.Layout = Layout

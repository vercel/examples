import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Layout, Page, Text, Button } from '@vercel/examples-ui'
import { MARKETING_BUCKETS } from '@lib/buckets'

export default function Marketing() {
  const router = useRouter()
  const setBucket = (bucket: string) => () => {
    Cookies.set('bucket-marketing', bucket)
    router.reload()
  }
  const removeBucket = () => {
    Cookies.remove('bucket-marketing')
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
      <Text className="mb-4">
        You can use the buttons below to change your assigned bucket and refresh
        the page:
      </Text>
      {MARKETING_BUCKETS.map((bucket) => (
        <Button
          key={bucket}
          variant="secondary"
          onClick={setBucket(bucket)}
          style={{ marginRight: '0.625rem' }}
        >
          Bucket {bucket.toUpperCase()}
        </Button>
      ))}
      <Button variant="black" onClick={removeBucket}>
        Remove bucket
      </Button>
    </Page>
  )
}

Marketing.Layout = Layout

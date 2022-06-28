import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Layout, Page, Text, Button } from '@vercel/examples-ui'
import { HOME_BUCKETS } from '@lib/buckets'

export default function Home() {
  const router = useRouter()
  const setBucket = (bucket: string) => () => {
    Cookies.set('bucket-home', bucket)
    router.reload()
  }
  const removeBucket = () => {
    Cookies.remove('bucket-home')
    router.reload()
  }
  const bucket = router.query.bucket as string

  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Home page variant
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently on <b>bucket {bucket.toUpperCase()}</b>
      </Text>
      <Text className="mb-4">
        You can use the buttons below to change your assigned bucket and refresh
        the page:
      </Text>
      {HOME_BUCKETS.map((bucket) => (
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

Home.Layout = Layout

export async function getStaticPaths() {
  return {
    paths: HOME_BUCKETS.map((bucket) => ({ params: { bucket } })),
    fallback: false,
  }
}

export async function getStaticProps() {
  // Here you would return data about the bucket
  return { props: {} }
}

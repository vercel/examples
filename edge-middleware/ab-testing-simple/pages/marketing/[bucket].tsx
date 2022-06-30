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
  const bucket = router.query.bucket as string

  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Marketing page variant
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently on <b>bucket {bucket.toUpperCase()}</b>
      </Text>
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

export async function getStaticPaths() {
  /**
   * For the marketing page, the `original` bucket (handled by `./original.tsx`)
   * represents the current marketing page without any changes, this is
   * useful if the variations are very different and you don't to merge
   * them on the same page.
   */
  const buckets = MARKETING_BUCKETS.filter((bucket) => bucket !== 'original')

  return {
    paths: buckets.map((bucket) => ({ params: { bucket } })),
    fallback: false,
  }
}

export async function getStaticProps() {
  // Here you would return data about the bucket
  return { props: {} }
}

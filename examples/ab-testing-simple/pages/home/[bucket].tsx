import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Page, Button } from '@components'
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
      <h1>Home page variant</h1>
      <h2>
        You're currently on <b>bucket {bucket.toUpperCase()}</b>
      </h2>
      <p>
        You can use the buttons below to change your assigned bucket and refresh
        the page:
      </p>
      {HOME_BUCKETS.map((bucket) => (
        <Button
          key={bucket}
          onClick={setBucket(bucket)}
          style={{ marginRight: '0.625rem' }}
        >
          Bucket {bucket.toUpperCase()}
        </Button>
      ))}
      <Button onClick={removeBucket}>Remove bucket</Button>
    </Page>
  )
}

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

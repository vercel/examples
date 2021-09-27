import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Page, Button } from '@components'
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
      <h1>Marketing page</h1>
      <h2>
        You're currently on <b>/marketing/original</b>
      </h2>
      <p>This is the original marketing page</p>
      <p>
        You can use the buttons below to change your assigned bucket and refresh
        the page:
      </p>
      {MARKETING_BUCKETS.map((bucket) => (
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

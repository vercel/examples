import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie'
import { Layout, Text, Page, Button, Code } from '@vercel/examples-ui'
import { BUCKETS, UID_COOKIE, EXPERIMENT_FLAG_KEY } from '../lib/constants'

interface Props {
  bucket: string
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  return {
    props: {
      bucket: params?.bucket as string,
    },
  }
}

export const getStaticPaths: GetStaticPaths<{ bucket: string }> = async () => {
  return {
    paths: BUCKETS.map((bucket) => ({ params: { bucket } })),
    fallback: false,
  }
}

function BucketPage({ bucket }: Props) {
  const { reload } = useRouter()

  function resetBucket() {
    Cookie.remove(UID_COOKIE)
    reload()
  }

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">A/B Testing with LaunchDarkly</Text>
        <Text>
          This example uses LaunchDarkly&apos;s Edge Config integration to
          assign users to experiment buckets at the edge. The assignment happens
          in <Code>middleware.ts</Code> and is based on a user ID stored in a
          cookie.
        </Text>
        <Text>
          Buckets are statically generated at build time so rewrites are fast.
          The middleware evaluates the <Code>{EXPERIMENT_FLAG_KEY}</Code> flag
          and rewrites the request to the matching bucket page.
        </Text>
        <pre className="bg-black text-white font-mono text-left py-2 px-4 rounded-lg text-sm leading-6">
          bucket: {bucket}
        </pre>
        <Button size="lg" onClick={resetBucket}>
          Reset bucket
        </Button>
        <Text>
          Clicking reset clears your user ID cookie. On the next visit,
          LaunchDarkly will assign you to a bucket again based on the flag
          configuration in your LaunchDarkly project.
        </Text>
      </section>
    </Page>
  )
}

BucketPage.Layout = Layout

export default BucketPage

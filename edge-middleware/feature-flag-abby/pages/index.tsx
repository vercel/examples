import { abby } from '@lib/abby'
import { Layout, Page, Text, Link, List } from '@vercel/examples-ui'
import { GetStaticPropsResult, InferGetStaticPropsType } from 'next'

type Props = InferGetStaticPropsType<typeof getStaticProps>
export default function Index({ myServerFlag }: Props) {
  const clientFlag = abby.useFeatureFlag('clientFlag')
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        AB testing with buckets
      </Text>
      <Text className="mb-4">
        In this demo we use cookies to assign a bucket with the variant to show.
        Visit one of the pages below and a bucket will be assigned to you.
      </Text>
      <List>
        <li>
          <Link href="/home">/home</Link>
        </li>
        <li>
          <Link href="/marketing">/marketing</Link>
        </li>
      </List>

      {clientFlag && (
        <Text className="mt-4">
          If you see this text the <b>client</b> flag is enabled
        </Text>
      )}
      {myServerFlag && (
        <Text className="mt-4">
          If you see this text the <b>server side</b> flag is enabled
        </Text>
      )}
    </Page>
  )
}

export const getStaticProps = () => {
  const myServerFlag = abby.getFeatureFlagValue('serverFlag')
  return {
    props: { myServerFlag },
  } satisfies GetStaticPropsResult<{}>
}

Index.Layout = Layout

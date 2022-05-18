import { Layout, Text, Page, Link, Code } from '@vercel/examples-ui'
import { AdBanner } from '../components/AdBanner'

function Home() {
  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">Loading Ads with the Script Component</Text>
        <Text>
          Ads on web pages are typically loaded from script tags, but without
          the proper attributes this can easily introduce a delay before a page
          becomes interactive. This is where the{' '}
          <Link
            href="https://nextjs.org/docs/api-reference/next/script"
            target="_blank"
          >
            Next.js Script Component
          </Link>{' '}
          comes into play.
        </Text>
        <Text>
          It allows you to change the loading priority of scripts. For this
          example we set the <Code>strategy</Code> prop to{' '}
          <Link
            href="https://nextjs.org/docs/basic-features/script#lazyonload"
            target="_blank"
          >
            &quot;lazyOnload&quot;
          </Link>{' '}
          so that ads load during idle time and don&apos;t hurt the{' '}
          <Link href="https://web.dev/interactive/" target="_blank">
            TTI
          </Link>
          .
        </Text>
        <Text>
          We have a loading state for ads while they load While our ads are
          loading, we show a fallback state to reserve a space for them and
          avoid a{' '}
          <Link href="https://web.dev/cls/" target="_blank">
            layout shift (CLS)
          </Link>
          .
        </Text>

        <Text>
          The example introduces a voluntary 3 second lag in loading the ad and
          it doesn&apos;t affect its{' '}
          <Link
            href="https://lighthouse-metrics.com/lighthouse/checks/b65fc6a3-323c-43fe-add7-6b82e22fcdb6"
            target="_blank"
          >
            lighthouse score
          </Link>
          .
        </Text>

        <Text className="italic font-bold">
          Note: Having an ad blocker will break this demo.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">Ad will show below</Text>

        <AdBanner height={250} width={300} />
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home

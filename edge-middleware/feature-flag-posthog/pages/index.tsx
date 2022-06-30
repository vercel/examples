import { getPostHogInstance } from '@lib/posthog'
import { Layout, Page, Text, List, Link, Button } from '@vercel/examples-ui'

export default function Index() {
  const resetVariant = () => {
    const posthog = getPostHogInstance()
    posthog.reset(true)
    window.location.reload()
  }

  return (
    <Page>
      <Text variant="h2" className="mb-6">
        AB testing with PostHog
      </Text>
      <Text className="mb-4">
        The about and marketing pages will each render a different version
        depending on the feature flag % of users set within PostHog:
      </Text>
      <List className="mb-4">
        <li>
          <Link href="/about">/about</Link>
        </li>
        <li>
          <Link href="/marketing">/marketing</Link>
        </li>
        <li>
          <Link href="/product">/product</Link>
        </li>
      </List>
      <Text className="text-lg mb-4">
        Click the button below to reset the variants for the current browser
        session.
      </Text>
      <div>
        <Button
          variant="secondary"
          className="mr-2.5"
          onClick={() => resetVariant()}
        >
          Reset feature flags
        </Button>
      </div>
    </Page>
  )
}

Index.Layout = Layout

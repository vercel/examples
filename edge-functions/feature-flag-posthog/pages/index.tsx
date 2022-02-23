import { FEATURE_FLAGS } from '@lib/constants'
import { getPostHogInstance } from '@lib/posthog'
import { getFeatureFlagVariant } from '@lib/posthog-node'
import { Layout, Page, Text, List, Link, Button } from '@vercel/examples-ui'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

export default function Index() {
  const resetVariant = () => {
    const posthog = getPostHogInstance()
    posthog.reset(true)
    window.location.reload()
  }

  const [productPageAvailable, setProductPageAvailable] = useState(false)

  useEffect(() => {
    const checkProductPageAvailability = async () => {
      const available = (await getFeatureFlagVariant(
        Cookies.get('distinct_id'),
        FEATURE_FLAGS.NEW_PRODUCT_PAGE
      ))
        ? true
        : false
      setProductPageAvailable(available)
    }

    checkProductPageAvailability()
  }, [])

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
      </List>
      {productPageAvailable && (
        <>
          <Text className="mb-4">
            The product page will render a different version depending on the
            multi-variate feature flag value set in PostHog (a, b, or c):
          </Text>
          <List className="mb-4">
            <li>
              <Link href="/product">/product</Link>
            </li>
          </List>
        </>
      )}
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

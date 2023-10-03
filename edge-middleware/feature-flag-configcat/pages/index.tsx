import Cookies from 'js-cookie'
import { createClient } from 'configcat-node'
import { Text, Code, List, Link, Button } from '@vercel/examples-ui'
import { useValue } from '@lib/use-configcat'
import ConfigcatLayout from '@components/layout'

export default function Index({
  isMyFirstFeatureEnabled,
}: {
  isMyFirstFeatureEnabled: boolean
}) {
  const clientSideFeatureEnabled = useValue('clientSideFeatureEnabled', false)
  const removeCookie = (name: string) => {
    Cookies.remove(name)
    window.location.reload()
  }

  return (
    <>
      <Text variant="h2" className="mb-6">
        AB testing with ConfigCat
      </Text>
      <Text className="mb-4">
        The about and marketing pages will each render a different version with
        a 50% chance:
      </Text>
      <List className="mb-4">
        <li>
          <Link href="/about">/about</Link>
        </li>
        <li>
          <Link href="/marketing">/marketing</Link>
        </li>
      </List>
      <Text className="mb-4">
        Click the buttons below if you want to change the current variant (each
        variant has a 50% chance)
      </Text>
      <div className="mb-4">
        <Button
          variant="secondary"
          className="mr-2.5"
          onClick={() => removeCookie('flag-newAboutPage')}
        >
          Remove /about cookie & reload
        </Button>
        <Button
          variant="secondary"
          onClick={() => removeCookie('flag-newMarketingPage')}
        >
          Remove /marketing cookie & reload
        </Button>
      </div>

      <Text className="text-lg mb-4">Feature Flags</Text>
      {isMyFirstFeatureEnabled ? (
        <Text className="mb-4">
          The feature flag called <Code>isMyFirstFeatureEnabled</Code> is{' '}
          <b>enabled</b> in your ConfigCat dashboard, and it was statically
          added to the page
        </Text>
      ) : (
        <Text className="mb-4">
          The feature flag called <Code>isMyFirstFeatureEnabled</Code> is{' '}
          <b>disabled</b> in your ConfigCat dashboard, enabling it will change
          this text
        </Text>
      )}
      {clientSideFeatureEnabled && (
        <Text>
          If you see this text is because the feature flag called{' '}
          <Code>clientSideFeatureEnabled</Code> is enabled in ConfigCat&apos;
          dashboard, and it was dynamically added to the page
        </Text>
      )}
    </>
  )
}

Index.Layout = ConfigcatLayout

export async function getStaticProps() {
  const configcat = createClient(process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY!)
  const isMyFirstFeatureEnabled = await configcat.getValueAsync(
    'isMyFirstFeatureEnabled',
    false
  )

  return { props: { isMyFirstFeatureEnabled } }
}

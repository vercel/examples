import Link from 'next/link'
import Cookies from 'js-cookie'
import { createClient } from 'configcat-node'
import { useValue } from '@lib/use-configcat'
import { Button, Code } from '@components'
import ConfigcatLayout from '@components/layout'

export default function Index({ isMyFirstFeatureEnabled }) {
  const clientSideFeatureEnabled = useValue('clientSideFeatureEnabled', false)
  const removeCookie = (name: string) => {
    Cookies.remove(name)
    window.location.reload()
  }

  return (
    <>
      <h1>AB testing with ConfigCat</h1>
      <p>
        The about and marketing pages will each render a different version with
        a 50% chance:
      </p>
      <ul>
        <li>
          <Link href="/about">
            <a>/about</a>
          </Link>
        </li>
        <li>
          <Link href="/marketing">
            <a>/marketing</a>
          </Link>
        </li>
      </ul>
      <p>
        Click the buttons below if you want to change the current variant (each
        variant has a 50% chance)
      </p>
      <Button
        onClick={() => removeCookie('flag-newAboutPage')}
        style={{ marginRight: '0.625rem' }}
      >
        Remove /about cookie & reload
      </Button>
      <Button onClick={() => removeCookie('flag-newMarketingPage')}>
        Remove /marketing cookie & reload
      </Button>

      <h2>Feature Flags</h2>
      {isMyFirstFeatureEnabled ? (
        <p>
          The feature flag called <Code>isMyFirstFeatureEnabled</Code> is{' '}
          <b>enabled</b> in your ConfigCat dashboard, and it was statically
          added to the page
        </p>
      ) : (
        <p>
          The feature flag called <Code>isMyFirstFeatureEnabled</Code> is{' '}
          <b>disabled</b> in your ConfigCat dashboard, enabling it will change
          this text
        </p>
      )}
      {clientSideFeatureEnabled && (
        <p>
          If you see this text is because the feature flag called{' '}
          <Code>clientSideFeatureEnabled</Code> is enabled in ConfigCat'
          dashboard, and it was dinamically added to the page
        </p>
      )}
    </>
  )
}

Index.Layout = ConfigcatLayout

export async function getStaticProps() {
  const configcat = createClient(process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY)
  const isMyFirstFeatureEnabled = await configcat.getValueAsync(
    'isMyFirstFeatureEnabled',
    false
  )

  return { props: { isMyFirstFeatureEnabled } }
}

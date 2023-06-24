import Cookies from 'js-cookie'
import { Layout, Page, Text, List, Link, Button, Code } from '@vercel/examples-ui'

export default function Index() {
  const removeCookie = (name: string) => {
    Cookies.remove(name)
    window.location.reload()
  }

  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Feature flags with Split
      </Text>
      <Text className="mb-4">
        In this demo we use <b>Split Browser SDK</b> within an <b>Edge middleware</b> and connected to a <b>Vercel Edge Config</b>, to pull feature flags from the edge.
      </Text>
      <Text className="mb-4">
        Before using this example, you will need a{' '}
        <Link href="https://www.split.io/signup/" target="_blank">Split account</Link>
        {' '}to set up feature flags and obtain a Split SDK Key. You will also need to follow the steps to{' '}
        <Link href="https://help.split.io/hc/en-us/articles/16469873148173#set-up-the-splits-vercel-integration" target="_blank">set up Split's Vercel integration</Link>
        , that will allow your feature flags to be stored and updated in a Vercel Edge Config instance connected to your project.
      </Text>
      <Text className="mb-4">
        The about and marketing pages below will each render a different version, depending on the configuration of a feature flag named <i>feature_flag_example</i>.
        Take a look at the <Code>middleware.ts</Code> file to know more.
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
        Click the button below if you want to change the current <i>Split user key</i>, randomly assigned, to get a different variant.
      </Text>
      <div>
        <Button
          variant="secondary"
          className="mr-2.5"
          onClick={() => removeCookie(`split_user_key`)}
        >
          Remove split_user_key cookie & reload
        </Button>
      </div>
    </Page>
  )
}

Index.Layout = Layout

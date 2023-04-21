import { Layout, Text, Page } from '@vercel/examples-ui'
import Explanation from '../components/explanation'

function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">HOME PAGE</Text>
        <Text>This page is the default version of HOME PAGE.</Text>
        <Text>
          You are seeing this old version, because feature flag with&nbsp;
          <b>new_home_page</b> feature key is disabled or you are not targeted.
        </Text>
      </section>
      <section className="flex flex-col gap-6">
        <Explanation />
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home

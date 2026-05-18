import { Layout, Text, Page } from '@vercel/examples-ui'
import Explanation from '../components/explanation'

function NewHomePage() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">NEW VERSION OF HOME PAGE</Text>
        <Text>This page is the new version of HOME PAGE</Text>
        <Text>
          You are seeing this new version, because feature flag with &nbsp;
          <b>new_home_page</b> feature key is enabled and you are targeted.
        </Text>
      </section>
      <section className="flex flex-col gap-6">
        <Explanation />
      </section>
    </Page>
  )
}

NewHomePage.Layout = Layout

export default NewHomePage

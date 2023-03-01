import { Layout, Link, Page, Text } from '@vercel/examples-ui'
import { PageType } from '../../utils'

const MiddlewarePage: PageType = () => (
  <Page>
    <Text>
      Middleware redirected you to variant:{' '}
      <span className="font-bold text-xl">B</span>
    </Text>
    <div className="pt-8">
      <Link href="/">Go back</Link>
    </div>
  </Page>
)

MiddlewarePage.Layout = Layout

export default MiddlewarePage

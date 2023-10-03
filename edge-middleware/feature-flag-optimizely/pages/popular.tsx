import { Layout } from '@vercel/examples-ui'
import PageComponent from '../components/page_component'

const Home = () => (
  <PageComponent
    title="Products (sorted by: Popular first)"
    products={[
      '1. Best Shirt ($69.99)',
      '2. Awesome Shoes ($49.99)',
      '3. Cool Socks ($9.99)',
    ]}
  />
)

export default Home

Home.Layout = Layout

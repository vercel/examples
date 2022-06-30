import { Layout } from '@vercel/examples-ui'
import PageComponent from '../components/page_component'

const Home = () => (
  <PageComponent
    title="Products sorted alphabetically"
    products={[
      '1. Awesome Shoes ($49.99)',
      '2. Best Shirt ($69.99)',
      '3. Cool Socks ($9.99)',
    ]}
  />
)

export default Home

Home.Layout = Layout

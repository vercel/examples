import { Explainer } from '../components/explainer'
import { Layout } from '@vercel/examples-ui'
import { GetStaticProps } from 'next'
import { getContent } from '../lib/getContent'

type Props = {
  joke: string
}

function Home(props: Props) {
  return <Explainer {...props} />
}

Home.Layout = Layout

export default Home

export const getStaticProps: GetStaticProps = async () => {
  // Fetch your own data here
  const joke = await getContent()
  return {
    props: {
      joke,
    },
  }
}

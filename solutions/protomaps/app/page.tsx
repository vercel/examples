import { Page, Text, Link } from '@vercel/examples-ui'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
})

export default function Home() {
  return (
    <Page className="flex flex-col gap-6">
      <Text variant="h1">Protomaps + NextJS example</Text>
      <Text variant="description">
        <Link href="https://protomaps.com/">Protomaps</Link> is a{' '}
        <strong>serverless</strong> system for planet-scale maps.
      </Text>
      <Map />
      <Text>
        An alternative to map APIs at 1% the cost, via single static files on
        your own cloud storage. Deploy datasets like OpenStreetMap for your site
        in minutes.
      </Text>
    </Page>
  )
}

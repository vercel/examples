import { LandingPage } from './_components/landing-page'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TrustClaw',
  description:
    'Your 24/7 AI assistant with 1000+ integrations via OAuth and sandboxed execution.',
  applicationCategory: 'Productivity',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  creator: {
    '@type': 'Organization',
    name: 'Composio',
    url: 'https://composio.dev',
  },
}

export default async function Page() {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <LandingPage />
    </>
  )
}

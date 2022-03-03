import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { Text, Button } from '@vercel/examples-ui'
import { getCurrentExperiment } from '@lib/optimize'
import { COOKIE_NAME } from '@lib/constants'
import { useGa } from '@lib/useGa'
import OptimizeLayout from '@components/layout'

export default function Marketing({ experiment, variant }) {
  const ga = useGa()
  const sendEvent = () => {
    const event = {
      hitType: 'event',
      eventCategory: 'AB Testing',
      eventAction: 'Clicked button',
      eventLabel: 'AB Testing Marketing button',
    }
    ga('send', event)
    console.log('sent event:', event)
  }

  useEffect(() => {
    const cookie = Cookies.get(COOKIE_NAME)
    if (ga && cookie) {
      ga('set', 'exp', cookie)
    }
    ga('send', 'pageview')
  }, [ga])

  return (
    <>
      <Text variant="h2" className="mb-6">
        Marketing page
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently looking at the variant <b>{variant.name}</b> in
        the experiment <b>{experiment.name}</b>
      </Text>
      <Text className="mb-4">
        Click the button below to register an event with GA for this variant:
      </Text>
      <Button variant="secondary" onClick={sendEvent}>
        Send event
      </Button>
    </>
  )
}

Marketing.Layout = OptimizeLayout

export async function getStaticPaths() {
  const experiment = getCurrentExperiment()

  return {
    paths: experiment.variants.map((v) => ({
      params: { variant: `${experiment.id}.${v.id}` },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const experiment = getCurrentExperiment()
  const [, variantId] = params.variant.split('.')

  // Here you could fetch any data related only to the variant
  return {
    props: {
      // Only send the experiment data required by the page
      experiment: { name: experiment.name },
      variant: experiment.variants.find((v) => String(v.id) === variantId),
    },
  }
}

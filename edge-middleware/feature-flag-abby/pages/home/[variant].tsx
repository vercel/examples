import { abby } from '@lib/abby'
import { Button, Layout, Page, Text } from '@vercel/examples-ui'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  const resetStoredVariant = () => {
    const resetVariant = abby.getABResetFunction('Home')
    resetVariant()
    router.reload()
  }
  const variant = (router.query.variant ?? '') as string

  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Home page variant
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently on <b>variant {variant.toUpperCase()}</b>
      </Text>
      <Button variant="black" onClick={resetStoredVariant}>
        Remove bucket
      </Button>
    </Page>
  )
}

export async function getStaticPaths() {
  return {
    paths: abby.getVariants('Home').map((variant) => {
      return {
        params: {
          variant,
        },
      }
    }),
    fallback: false,
  }
}

export async function getStaticProps() {
  // Here you would return data about the bucket
  return { props: {} }
}

Home.Layout = Layout

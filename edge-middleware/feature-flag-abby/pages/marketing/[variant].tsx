import { abby } from '@lib/abby'
import { Button, Layout, Page, Text } from '@vercel/examples-ui'
import { useRouter } from 'next/router'

export default function Marketing() {
  const router = useRouter()

  const resetStoredVariant = () => {
    const resetVariant = abby.getABResetFunction('Marketing')
    resetVariant()
    router.reload()
  }
  const variant = (router.query.variant ?? '') as string

  return (
    <Page>
      <Text variant="h2" className="mb-6">
        Marketing page variant
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently on <b>variant {variant.toUpperCase()}</b>
      </Text>

      <Button type="button" variant="black" onClick={resetStoredVariant}>
        Reset Variant
      </Button>
    </Page>
  )
}

export async function getStaticPaths() {
  return {
    paths: abby
      .getVariants('Marketing')
      .filter((v) => v !== 'original')
      .map((variant) => {
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

Marketing.Layout = Layout

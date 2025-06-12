import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { Toaster } from 'sonner'
import { FreeDelivery } from '@/app/free-delivery'
import { FlagValues } from 'flags/react'
import { DevTools } from '@/components/dev-tools'
import { productFlags, showFreeDeliveryBannerFlag } from '@/flags'
import { deserialize, generatePermutations } from 'flags/next'
import { GrowthbookTracking } from '@/components/growthbook/client-side-tracking/growthbook-tracking'

export async function generateStaticParams() {
  const codes = await generatePermutations(productFlags)
  return codes.map((code) => ({ code }))
}

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{
    code: string
  }>
}) {
  const params = await props.params
  const values: Record<string, unknown> = await deserialize(
    productFlags,
    params.code
  )
  const featureIds = Object.keys(values)

  const showFreeDeliveryBanner = await showFreeDeliveryBannerFlag(
    params.code,
    productFlags
  )

  return (
    <>
      <Toaster />
      <div className="bg-white">
        <FreeDelivery show={showFreeDeliveryBanner} />
        <Navigation />
        {props.children}
        <FlagValues values={values} />

        {/* If using client-side tracking, include this component whenever a feature with experiment is evaluated */}
        <GrowthbookTracking featureIds={featureIds} />

        <Footer />
        <DevTools />
      </div>
    </>
  )
}

import { deserialize, generatePermutations } from 'flags/next'
import { FlagValues } from 'flags/react'
import { productFlags, showFreeDeliveryBannerFlag } from '@/flags'
import { DevTools } from '@/components/dev-tools'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { FreeDeliveryBanner } from '@/components/banners/free-delivery-banner'

// Allow codes we didn't pre-generate, and generate them on-demand
export const dynamicParams = true

export async function generateStaticParams() {
  // Returning an empty array here is important as it enables ISR, so
  // the various combinations stay cached after they first time they were rendered.
  //
  // return [];

  // Instead of returning an empty array you could also call generatePermutations
  // to generate the permutations upfront.
  const codes = await generatePermutations(productFlags)
  return codes.map((code) => ({ code }))
}

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{
    code: string
  }>
}) {
  const { code } = await props.params
  const values = await deserialize(productFlags, code)

  const showFreeDeliveryBanner = await showFreeDeliveryBannerFlag(
    code,
    productFlags
  )

  return (
    <div className="bg-white">
      {showFreeDeliveryBanner ? <FreeDeliveryBanner /> : null}
      <Navigation />
      {props.children}
      <FlagValues values={values} />
      <Footer />
      <DevTools />
    </div>
  )
}

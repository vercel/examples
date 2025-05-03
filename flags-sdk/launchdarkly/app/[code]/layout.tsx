import { StaticLDProvider } from '@/launchdarkly/launchdarkly-provider'
import { deserialize, generatePermutations } from 'flags/next'
import { FlagValues } from 'flags/react'
import { productFlags, showFreeDeliveryBannerFlag } from '@/flags'
import { FreeDelivery } from '@/app/free-delivery'
import { DevTools } from '@/components/dev-tools'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'

export async function generateStaticParams() {
  // Returning an empty array here is important as it enables ISR, so
  // the various combinations stay cached after they first time they were rendered.
  //
  // return [];

  // Instead of returning an empty array you could also call generatePermutations
  // to generate the permutations upfront.
  const codes = await generatePermutations(productFlags);
  return codes.map((code) => ({ code }));
}

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{
    code: string
  }>
}) {
  const params = await props.params;
  const values = await deserialize(productFlags, params.code);
  
  const showFreeDeliveryBanner = await showFreeDeliveryBannerFlag(
    params.code,
    productFlags,
  );

  return (
    <StaticLDProvider>
      <div className="bg-white">
        <FreeDelivery
          show={showFreeDeliveryBanner}
          flagKey={showFreeDeliveryBannerFlag.key}
        />
        <Navigation />
        {props.children}
        <FlagValues values={values} />
        <Footer />
        <DevTools />
      </div>
    </StaticLDProvider>
  );
}

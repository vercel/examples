import {
  HeadTags,
  HeroSection,
  Layout,
  StatelessDoneRightSection,
  TryRenovationSection,
  TwoStrategiesSection,
  CTASection,
} from 'components'

export default function Home() {
  return (
    <Layout>
      <HeadTags />
      <HeroSection />
      <TwoStrategiesSection />
      <StatelessDoneRightSection />
      <TryRenovationSection />
      <CTASection />
    </Layout>
  )
}

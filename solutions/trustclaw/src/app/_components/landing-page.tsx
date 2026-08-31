import { LandingNav } from './landing-nav'
import { HeroSection } from './hero-section'
import { FeaturesSection } from './features-section'
import { SecuritySection } from './security-section'
import { ComparisonSection } from './comparison-section'
import { FloatingPromptsSection } from './floating-prompts-section'
import { BottomCtaSection } from './bottom-cta-section'
import { TrustClawBrand } from './trustclaw-brand'

export function LandingPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col overflow-x-hidden">
      <LandingNav />
      <main className="flex-1 pt-14">
        <HeroSection />
        <FeaturesSection />
        <SecuritySection />
        <ComparisonSection />
        <FloatingPromptsSection />
        <BottomCtaSection />
      </main>
      <footer className="border-border border-t px-4 py-6">
        <div className="flex justify-center">
          <TrustClawBrand size="sm" />
        </div>
      </footer>
    </div>
  )
}

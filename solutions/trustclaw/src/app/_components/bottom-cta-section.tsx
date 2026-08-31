import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '~/components/ui/button'
import Link from 'next/link'
import { AnimateOnView } from '~/components/core/animate-on-view'

export function BottomCtaSection() {
  return (
    <section className="border-border relative overflow-hidden border-t px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.488_0.243_264.376/0.08),transparent_70%)]" />
      <Image
        src="/images/elements/cube.svg"
        alt=""
        aria-hidden
        width={151}
        height={139}
        priority={false}
        className="pointer-events-none absolute -right-6 bottom-10 hidden h-20 w-20 opacity-15 md:right-20 md:h-28 md:w-28 dark:block"
      />

      <AnimateOnView className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
          Ready to meet your personal assistant?
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          Your AI is waiting. Set it up in seconds.
        </p>
        <Link href="/login">
          <Button size="lg" className="h-12 w-full px-8 text-base sm:w-auto">
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </AnimateOnView>
    </section>
  )
}

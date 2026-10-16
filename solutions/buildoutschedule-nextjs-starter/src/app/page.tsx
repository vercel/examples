import { BookingSection } from '@/components/booking-section';
import { scheduleConfig } from '@/lib/config';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold tracking-tight">
            Buildout Schedule Starter
          </span>
          <a
            href="https://buildoutschedule.com"
            className="text-sm text-ink-soft transition-colors hover:text-ink"
          >
            buildoutschedule.com
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-5xl px-6 pb-8 pt-16 text-center">
          <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Book time without the back-and-forth.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
            This site has a live booking page built in. Pick a time below and
            you&apos;ll get a confirmation email with reschedule and cancel
            links. Buildout Schedule handles the rest.
          </p>
        </section>

        <section className="mx-auto w-full max-w-3xl px-6 pb-20">
          <div className="overflow-hidden rounded-2xl border border-line bg-paper-soft shadow-sm">
            <BookingSection
              workspace={scheduleConfig.workspace}
              eventType={scheduleConfig.eventType}
            />
          </div>
          <p className="mt-4 text-center text-sm text-ink-soft">
            Powered by Buildout Schedule
          </p>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-ink-soft sm:flex-row">
          <span>
            Built with{' '}
            <a
              href="https://www.npmjs.com/package/@buildoutstudios/schedule"
              className="underline underline-offset-2 hover:text-ink"
            >
              @buildoutstudios/schedule
            </a>
          </span>
          <a
            href="https://buildoutschedule.com"
            className="underline underline-offset-2 hover:text-ink"
          >
            Get your own booking page
          </a>
        </div>
      </footer>
    </div>
  );
}

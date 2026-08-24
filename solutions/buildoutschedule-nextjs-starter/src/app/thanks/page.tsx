import Link from 'next/link';

import { LocalTime } from '@/components/local-time';

interface ThanksPageProps {
  searchParams: Promise<{ start?: string }>;
}

export default async function ThanksPage({ searchParams }: ThanksPageProps) {
  const { start } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="text-5xl" aria-hidden>
          ✓
        </p>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          You&apos;re booked.
        </h1>
        {start ? (
          <div className="mt-4">
            <LocalTime iso={start} />
          </div>
        ) : null}
        <p className="mt-4 text-ink-soft">
          A confirmation email is on the way with your calendar invite. Plans
          change? That same email has reschedule and cancel links.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:bg-paper-soft"
        >
          Back to the homepage
        </Link>
      </div>
    </main>
  );
}

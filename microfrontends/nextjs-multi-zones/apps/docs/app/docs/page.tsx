import type { ReactNode } from 'react';
import Image from 'next/image';
import { Link } from '@vercel/microfrontends/next/client';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import mfeIcon from '../../public/mfe-icon-dark.png';

function ExternalTextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
      <ExternalLink aria-hidden="true" className="size-3.5" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="flex flex-row gap-2 text-2xl font-bold text-gray-900">
            <Image
              alt="MFE Icon"
              className="inline-block"
              height={32}
              src={mfeIcon}
              width={32}
            />
            Vercel Microfrontends
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  className="text-gray-600 hover:text-gray-900"
                  href="#getting-started"
                >
                  Getting Started
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 hover:text-gray-900"
                  href="#learn-more"
                >
                  Learn more
                </Link>
              </li>
              <li>
                <Link className="text-blue-600 hover:text-blue-800" href="/">
                  Back to Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Documentation
          </h2>

          <section className="mb-12" id="getting-started">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Getting Started
            </h3>
            <p className="text-gray-600 mb-4">
              This <code>/docs</code> page is a separate Next.js app, routed
              here by Vercel Microfrontends. The fastest way to set up the same
              architecture is to give your coding agent the{' '}
              <code>microfrontends</code> skill.
            </p>
            <p className="text-gray-600 mb-2">
              Install the{' '}
              <ExternalTextLink href="https://vercel.com/docs/agent-resources/vercel-plugin">
                Vercel plugin
              </ExternalTextLink>{' '}
              (includes the skill), or install the skill on its own:
            </p>
            <pre className="mb-4 overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100">
              <code>{`npx plugins add vercel/vercel-plugin\n# or\nnpx skills add vercel/microfrontends`}</code>
            </pre>
            <p className="text-gray-600 mb-2">Then ask your agent:</p>
            <blockquote className="mb-4 border-l-4 border-blue-600 bg-blue-50 px-4 py-3 text-gray-700">
              Use the microfrontends skill to set up this Next.js multi-zones
              example. Install dependencies and start local development.
            </blockquote>
            <p className="text-gray-600">
              In Cursor you can also run{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 text-sm">
                /add-plugin vercel
              </code>
              .
            </p>
          </section>

          <section className="mb-12" id="learn-more">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Learn more
            </h3>
            <p className="text-gray-600 mb-4">
              Official docs and the skill your agent should use:
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li className="mb-2">
                <ExternalTextLink href="https://vercel.com/docs/microfrontends">
                  Vercel Microfrontends documentation
                </ExternalTextLink>
              </li>
              <li className="mb-2">
                <ExternalTextLink href="https://vercel.com/docs/agent-resources/vercel-plugin">
                  Vercel plugin for coding agents
                </ExternalTextLink>
              </li>
              <li>
                <ExternalTextLink href="https://vercel.com/changelog/manage-vercel-microfrontends-with-ai-agents-and-the-cli">
                  Microfrontends skill and CLI
                </ExternalTextLink>
              </li>
            </ul>
          </section>

          <div className="mt-8">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            &copy; 2026 Vercel Microfrontends All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

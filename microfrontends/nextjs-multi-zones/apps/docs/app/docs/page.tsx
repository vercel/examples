import Image from 'next/image';
import { Link } from '@vercel/microfrontends/next/client';
import { Button } from '@/components/ui/button';
import mfeIcon from '../../public/mfe-icon-dark.png';

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
                  href="#examples"
                >
                  Examples
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
              Welcome to Vercel Microfrontends documentation. This guide will
              help you get started with implementing microfrontends in your
              project.
            </p>
            <ol className="list-decimal list-inside text-gray-600">
              <li className="mb-2">Install the Microfrontends CLI tool</li>
              <li className="mb-2">Create your first microfrontend</li>
              <li className="mb-2">Configure the host application</li>
              <li>Deploy your microfrontends</li>
            </ol>
          </section>

          <section className="mb-12" id="examples">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Examples</h3>
            <p className="text-gray-600 mb-4">
              Check out these examples to see Vercel Microfrontends in action:
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li className="mb-2">Basic microfrontend setup</li>
              <li className="mb-2">Communication between microfrontends</li>
              <li className="mb-2">Shared state management</li>
              <li>Microfrontend with different frameworks</li>
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
            &copy; 2025 Vercel Microfrontends All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

import Image from 'next/image';
import { Link } from '@vercel/microfrontends/next/client';
import { Button } from '@/components/ui/button';
import mfeIcon from '../public/mfe-icon-dark.png';

export default function Home() {
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
                <Link className="text-gray-600 hover:text-gray-900" href="#">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 hover:text-gray-900"
                  href="#features"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 hover:text-gray-900" href="#">
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  className="text-blue-600 hover:text-blue-800"
                  href="/docs"
                >
                  Docs
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
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

function HeroSection() {
  return (
    <section className="bg-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Revolutionize Your Frontend
        </h2>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Build scalable and maintainable web applications with our
          microfrontend architecture.
        </p>
        <div className="mt-8">
          <Link href="/docs">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: 'Independent Deployment',
      description:
        'Deploy each microfrontend separately for faster iterations.',
    },
    {
      title: 'Technology Agnostic',
      description:
        'Use different frameworks or libraries for each microfrontend.',
    },
    {
      title: 'Scalable Teams',
      description:
        'Enable multiple teams to work on different parts of the application simultaneously.',
    },
    {
      title: 'Improved Performance',
      description:
        'Load only the necessary parts of your application for better performance.',
    },
  ];

  return (
    <section className="py-20" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div className="bg-white shadow rounded-lg p-6" key={feature.title}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join the microfrontend revolution today and build better web
          applications.
        </p>
        <Button size="lg" variant="secondary">
          Start Free Trial
        </Button>
      </div>
    </section>
  );
}

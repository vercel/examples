import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import './globals.css';

function Landing(): React.JSX.Element {
  return (
    <>
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Your Product, Your Vision, Our Platform
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Empower your business with our cutting-edge solution.
                    Streamline workflows, boost productivity, and achieve your
                    goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <button
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 gap-1"
                    type="button"
                  >
                    Get Started
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
                    type="button"
                  >
                    Learn More
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Product Dashboard"
                  className="rounded-lg object-cover"
                  height="550"
                  src="product-dashboard-overview.png"
                  width="550"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-20" id="features">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Key Features
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Discover the powerful features that set our platform apart from
                the competition.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start gap-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Intuitive Interface</h3>
                <p className="text-muted-foreground">
                  Our user-friendly interface makes navigation and operation a
                  breeze for all users.
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Gain valuable insights with our comprehensive analytics and
                  reporting tools.
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Seamless Integration</h3>
                <p className="text-muted-foreground">
                  Easily integrate with your existing tools and workflows
                  without disruption.
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Real-time Collaboration</h3>
                <p className="text-muted-foreground">
                  Work together with your team in real-time, no matter where
                  they are located.
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Automated Workflows</h3>
                <p className="text-muted-foreground">
                  Save time and reduce errors with our intelligent automation
                  capabilities.
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Enterprise Security</h3>
                <p className="text-muted-foreground">
                  Rest easy knowing your data is protected by industry-leading
                  security measures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20" id="testimonials">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Clients Say
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Don&apos;t just take our word for it. Here&apos;s what our
                clients have to say about our platform.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <p className="text-muted-foreground">
                    &quot;This platform has completely transformed how we
                    operate. The efficiency gains have been remarkable.&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      alt="Sarah Johnson"
                      className="rounded-full"
                      height="40"
                      src="thoughtful-artist.png"
                      width="40"
                    />
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">
                        CEO, TechCorp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <p className="text-muted-foreground">
                    &quot;The intuitive interface and powerful features make
                    this the perfect solution for our team&apos;s needs.&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      alt="Michael Chen"
                      className="rounded-full"
                      height="40"
                      src="thoughtful-artist.png"
                      width="40"
                    />
                    <div>
                      <p className="font-medium">Michael Chen</p>
                      <p className="text-sm text-muted-foreground">
                        CTO, InnovateCo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <p className="text-muted-foreground">
                    &quot;Customer support is exceptional. Any issues we&apos;ve
                    had were resolved quickly and professionally.&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      alt="Emily Rodriguez"
                      className="rounded-full"
                      height="40"
                      src="thoughtful-artist.png"
                      width="40"
                    />
                    <div>
                      <p className="font-medium">Emily Rodriguez</p>
                      <p className="text-sm text-muted-foreground">
                        Operations Manager, GrowthInc
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-muted py-20" id="pricing">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Choose the plan that&apos;s right for your business. All plans
                include a 14-day free trial.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {/* Basic Plan */}
              <div className="flex flex-col rounded-lg border bg-background shadow transition-all hover:shadow-lg">
                <div className="p-6">
                  <h3 className="text-2xl font-bold">Basic</h3>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">
                      $29
                    </span>
                    <span className="ml-1 text-xl font-semibold">/month</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Perfect for small teams and startups.
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>Up to 5 team members</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>20GB storage</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>Basic analytics</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>Email support</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto p-6 pt-0">
                  <button
                    className="w-full rounded-md border border-primary bg-background px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    type="button"
                  >
                    Start Free Trial
                  </button>
                </div>
              </div>

              {/* Pro Plan (Featured) */}
              <div className="flex flex-col rounded-lg border-2 border-primary bg-background shadow-lg transition-all hover:shadow-xl">
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">Pro</h3>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Popular
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">
                      $79
                    </span>
                    <span className="ml-1 text-xl font-semibold">/month</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Ideal for growing businesses and teams.
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>Up to 20 team members</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>100GB storage</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>Custom integrations</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto p-6 pt-0">
                  <button
                    className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    type="button"
                  >
                    Start Free Trial
                  </button>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="flex flex-col rounded-lg border bg-background shadow transition-all hover:shadow-lg">
                <div className="p-6">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">
                      $199
                    </span>
                    <span className="ml-1 text-xl font-semibold">/month</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    For large organizations with advanced needs.
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>Unlimited team members</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>1TB storage</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>Enterprise analytics</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>24/7 dedicated support</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>Custom development</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 text-primary mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="m9 11 3 3L22 4" />
                      </svg>
                      <span>SLA guarantees</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto p-6 pt-0">
                  <button
                    className="w-full rounded-md border border-primary bg-background px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    type="button"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                Need a custom plan?
                <a
                  className="font-medium text-primary hover:underline"
                  href="/"
                >
                  Contact us
                </a>
                for a tailored solution.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20" id="about">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About Our Company
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                We&apos;re on a mission to transform how businesses operate with
                innovative solutions.
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Our Story</h3>
                <p className="text-muted-foreground">
                  Founded in 2010, our company began with a simple idea: to
                  create software that actually helps businesses grow. What
                  started as a small team of passionate developers has grown
                  into a global company serving thousands of customers across
                  various industries.
                </p>
                <p className="text-muted-foreground">
                  Our journey has been defined by continuous innovation,
                  customer-centric development, and a commitment to excellence.
                  We believe that technology should empower businesses, not
                  complicate them.
                </p>

                <h3 className="text-2xl font-bold mt-8">Our Mission</h3>
                <p className="text-muted-foreground">
                  We&apos;re on a mission to democratize access to powerful
                  business tools. We believe that every organization, regardless
                  of size or budget, deserves access to technology that can
                  transform their operations and drive growth.
                </p>

                <h3 className="text-2xl font-bold mt-8">Our Values</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <svg
                      className="size-5 text-primary mr-2 mt-0.5"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                    <span>
                      <strong>Innovation:</strong> We constantly push the
                      boundaries of what&apos;s possible.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="size-5 text-primary mr-2 mt-0.5"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                    <span>
                      <strong>Integrity:</strong> We operate with transparency
                      and honesty in all we do.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="size-5 text-primary mr-2 mt-0.5"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                    <span>
                      <strong>Customer Focus:</strong> Our customers&apos;
                      success is our success.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="size-5 text-primary mr-2 mt-0.5"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                    <span>
                      <strong>Excellence:</strong> We strive for excellence in
                      everything we do.
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <div className="relative h-[400px] overflow-hidden rounded-lg">
                  <img
                    alt="Our Team"
                    className="absolute inset-0 h-full w-full object-cover"
                    src="team-photo.jpg"
                  />
                </div>

                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">Leadership Team</h3>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="flex flex-col items-center text-center">
                      <img
                        alt="CEO Portrait"
                        className="size-24 rounded-full object-cover mb-4"
                        src="ceo-portrait.jpg"
                      />
                      <h4 className="text-lg font-bold">Sarah Johnson</h4>
                      <p className="text-sm text-muted-foreground">
                        CEO & Co-Founder
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <img
                        alt="CTO Portrait"
                        className="size-24 rounded-full object-cover mb-4"
                        src="cto-portrait.jpg"
                      />
                      <h4 className="text-lg font-bold">Michael Chen</h4>
                      <p className="text-sm text-muted-foreground">
                        CTO & Co-Founder
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="mx-auto max-w-[700px] md:text-xl">
                  Join thousands of satisfied customers who have transformed
                  their business with our platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <button
                  className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 py-2 text-sm font-medium text-primary shadow transition-colors hover:bg-white/90"
                  type="button"
                >
                  Start Free Trial
                </button>
                <button
                  className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10"
                  type="button"
                >
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Landing,
  errorBoundary() {
    return <></>;
  },
});

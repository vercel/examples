export function CTASection() {
  return (
    <div className="bg-indigo-600">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
          <span className="block">Ready for authentication at the edge?</span>
        </h2>
        <p className="mt-4 text-base text-indigo-200 text-base sm:text-lg md:text-xl">
          Stateless, revocable authentication is included in every Clerk plan.
        </p>
        <div className="sm:flex sm:justify-center mt-8">
          <a
            href="https://dashboard.clerk.dev/sign-up?utm_source=edge-demo&utm_medium=next-edge-auth&utm_campaign=start-building"
            className="mb-4 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Start building
          </a>
          <a
            href="https://clerk.dev/solutions/nextjs-authentication?utm_source=edge-demo&utm_medium=next-edge-auth&utm_campaign=more-cta"
            className="sm:ml-4 mb-4 w-full inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto"
          >
            More about Clerk and Next.js
          </a>
        </div>
      </div>
    </div>
  )
}

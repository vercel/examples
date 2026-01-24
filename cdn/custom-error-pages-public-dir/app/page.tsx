import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 py-12 px-8 bg-white dark:bg-black sm:items-start sm:px-16">
        <Image
          className="dark:invert"
          src="/vercel.svg"
          alt="Vercel logo"
          width={120}
          height={28}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-lg text-3xl font-semibold leading-10 tracking-tight text-black text-balance dark:text-zinc-50">
            Custom Error Pages with Public Directory
          </h1>
          <p className="max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-400">
            This example demonstrates how to create custom error pages using
            static HTML files in the public directory. Replace Vercel&apos;s
            default platform error pages with your own branded experience for
            errors like function timeouts or throttling.
          </p>
          <div className="max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-400">
            <p className="font-medium text-zinc-800 dark:text-zinc-200">
              How it works:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                Add static HTML files at <code className="text-sm bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">public/500.html</code> and{" "}
                <code className="text-sm bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">public/504.html</code>
              </li>
              <li>
                Vercel automatically detects and serves these for platform
                errors
              </li>
              <li>
                The 500 page acts as a fallback for all unhandled error codes
              </li>
            </ul>
          </div>
          <div className="max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-400">
            <p className="font-medium text-zinc-800 dark:text-zinc-200">
              Template tokens:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <code className="text-sm bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">::vercel:REQUEST_ID::</code> - Unique request identifier
              </li>
              <li>
                <code className="text-sm bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">::vercel:ERROR_CODE::</code> - Error type (e.g.,
                FUNCTION_INVOCATION_TIMEOUT)
              </li>
            </ul>
          </div>
          <div className="max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-400">
            <p className="font-medium text-zinc-800 dark:text-zinc-200">
              Try it out:
            </p>
            <p className="mt-2">
              Click &quot;Trigger Timeout&quot; to trigger a function timeout and see
              the custom error page in action. The page is configured to timeout
              after 3 seconds.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row sm:flex-wrap">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-950 dark:hover:bg-[#ccc] dark:focus-visible:ring-zinc-300 sm:w-auto"
            href="/slow-page"
          >
            Trigger Timeout
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-950 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] dark:focus-visible:ring-zinc-300 sm:w-auto"
            href="https://github.com/vercel/examples/tree/main/cdn/custom-error-pages-public-dir"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-950 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] dark:focus-visible:ring-zinc-300 sm:w-auto"
            href="https://vercel.com/docs/custom-error-pages"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}

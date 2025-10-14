import Link from 'next/link'

export function ExamplesBanner() {
  return (
    <nav className="antialiased border-b border-gray-200 py-5 relative z-20 bg-background shadow-[0_0_15px_0_rgb(0,0,0,0.1)]">
      <div className="flex items-center lg:px-6 px-8 mx-auto max-w-7xl">
        <div className="flex flex-row items-center">
          <Link
            className="text-link hover:text-link-light transition-colors no-underline [&_code]:text-link [&_code]:hover:text-link-light [&_code]:transition-colors"
            href="/"
          >
            <span>
              <svg height="26" viewBox="0 0 75 65" fill="#000">
                <title>Vercel Logo</title>
                <path d="M37.59.25l36.95 64H.64l36.95-64z" />
              </svg>
            </span>
          </Link>
          <ul className="flex items-center content-center">
            <li className="ml-2 text-gray-200">
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: Divider */}
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <path d="M16.88 3.549L7.12 20.451" />
              </svg>
            </li>
            <li className="font-medium" style={{ letterSpacing: '.01px' }}>
              <Link
                className="text-link hover:text-link-light transition-colors no-underline [&_code]:text-link [&_code]:hover:text-link-light [&_code]:transition-colors text-accents-6 duration-200 hover:text-accents-8 cursor-pointer"
                target="_blank"
                rel="noreferrer"
                href="https://github.com/vercel/examples/tree/main/flags-sdk/flagsmith"
              >
                Vercel Examples / Flags SDK / Flagsmith
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex-1 justify-end hidden md:flex">
          <nav className="flex-row inline-flex items-center">
            <span className="ml-2 h-full flex items-center cursor-not-allowed text-accents-5">
              <Link
                data-variant="ghost"
                className="relative inline-flex items-center justify-center cursor pointer no-underline px-3.5 rounded-md font-medium outline-0 select-none align-middle whitespace-nowrap transition-colors ease-in duration-200 text-success hover:bg-[rgba(0,68,255,0.06)] h-10 leading-10 text-[15px]"
                href="https://github.com/vercel/examples/tree/main"
                target="_blank"
                rel="noreferrer"
              >
                More Examples →
              </Link>
            </span>
            <span className="ml-2 h-full flex items-center cursor-not-allowed text-accents-5">
              <Link
                data-variant="primary"
                className="relative inline-flex items-center justify-center cursor pointer no-underline px-3.5 rounded-md font-medium outline-0 select-none align-middle whitespace-nowrap transition-colors ease-in duration-200 border border-solid text-background bg-success border-success-dark hover:bg-success/90 shadow-[0_5px_10px_rgb(0,68,255,0.12)] h-10 leading-10 text-[15px]"
                href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fflags-sdk/flagsmith&env=FLAGS_SECRET&env=FLAGSMITH_ENVIRONMENT_ID&env=FLAGSMITH_PROJECT_ID&envDescription=The+FLAGS_SECRET+will+be+used+by+the+Flags+Explorer+to+securely+overwrite+feature+flags.+Must+be+32+random+bytes%2C+base64-encoded.+Use+the+generated+value+or+set+your+own.&envLink=https%3A%2F%2Fvercel.com%2Fdocs%2Fworkflow-collaboration%2Ffeature-flags%2Fsupporting-feature-flags%23flags_secret-environment-variable&project-name=flagsmith-flags-sdk-example&repository-name=flagsmith-flags-sdk-example"
                target="_blank"
                rel="noreferrer"
              >
                Clone & Deploy
              </Link>
            </span>
          </nav>
        </div>
      </div>
    </nav>
  )
}

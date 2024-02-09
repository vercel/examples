import { headers } from 'next/headers'
import { EU_COUNTRY_CODES } from './constants'
import Script from 'next/script'

export default function Analytics() {
  const countryCode = headers().get('x-vercel-ip-country') || 'US'

  if (EU_COUNTRY_CODES.includes(countryCode)) {
    return (
      <div className="fixed right-5 font-mono top-5 flex space-x-2 items-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 px-4 py-2 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:rounded-lg lg:border lg:bg-gray-200 lg:dark:bg-zinc-800/30">
        <img src={`https://flag.vercel.app/m/${countryCode}.svg`} />
        <p className="text-sm font-semibold">Google Analytics Tag NOT loaded</p>
      </div>
    )
  }

  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
      <Script id="google-analytics">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'GA_MEASUREMENT_ID');
      `}
      </Script>
      <div className="fixed right-5 font-mono top-5 flex space-x-2 items-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 px-4 py-2 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:rounded-lg lg:border lg:bg-gray-200 lg:dark:bg-zinc-800/30">
        <img src={`https://flag.vercel.app/m/${countryCode}.svg`} />
        <p className="text-sm font-semibold">Google Analytics Tag loaded</p>
      </div>
    </>
  )
}

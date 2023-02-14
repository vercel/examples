'use client'

import { useState } from 'react'

export const CookieBanner = () => {
  const [showCookieBanner, setCookieBanner] = useState(false)

  return !showCookieBanner ? null : (
    <div className="z-10 fixed bg-white w-full py-12 bottom-0 left-0 right-0 border-t-2">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        <div className="col-span-9 text-sm font-medium">
          We use cookies and similar methods to recognize visitors and remember
          their preferences. We also use them to measure ad campaign
          effectiveness, target ads and analyze site traffic. To learn more
          about these methods, including how to disable them, view our Cookie
          Policy. Starting on July 20, 2020 we will show you ads we think are
          relevant to your interests, based on the kinds of content you access
          in our Services. You can object. For more info, see our privacy
          policy. By tapping ‘accept,’ you consent to the use of these methods
          by us and third parties. You can always change your tracker
          preferences by visiting our Cookie Policy.
        </div>
        <div className="col-span-3">
          <div className="space-y-2 px-10">
            <button
              className="bg-neutral-700 text-white uppercase font-semibold rounded-md py-2.5 px-12 w-full text-sm"
              onClick={() => setCookieBanner(false)}
            >
              Accept
            </button>
            <button className="bg-neutral-700 text-white uppercase font-semibold rounded-md py-2.5 px-12 w-full text-sm">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

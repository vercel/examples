'use client'

import { useState } from 'react'

export const Ad = () => {
  const [showAd, setAd] = useState(false)

  return !showAd ? null : (
    <div className="h-[274px] bg-[#f3eae5] px-10">
      {/* <Image src="" /> */}
      <button className="" onClick={() => setAd(false)}>
        Close
      </button>
    </div>
  )
}

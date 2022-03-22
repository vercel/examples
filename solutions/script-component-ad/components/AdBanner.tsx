import React, { CSSProperties, useEffect } from 'react'

type Props = Pick<CSSProperties, 'height' | 'width'>

export const AdBanner: React.FC<Props> = (props) => {
  const [loading, setLoading] = React.useState(true)
  useEffect(() => {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const { googletag } = window
        googletag.cmd.push(() => {
          googletag.display('banner-ad')
        })
        setLoading(false)
      }
    }, 3000)
  }, [])

  return (
    <div id="banner-ad" style={{ ...props }}>
      {loading ? (
        <div className="w-full h-full border-2 rounded-md mx-auto">
          <div className="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
            <div className="w-12 bg-gray-300 h-12 rounded-full "></div>
            <div className="flex flex-col space-y-3">
              <div className="w-36 bg-gray-300 h-6 rounded-md "></div>
              <div className="w-24 bg-gray-300 h-6 rounded-md "></div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

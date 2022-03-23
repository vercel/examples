import { CSSProperties, FC, useState, useEffect } from 'react'

type Props = Pick<CSSProperties, 'height' | 'width'>

export const AdBanner: FC<Props> = (props) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      const { googletag } = window

      googletag.cmd.push(() => {
        googletag.display('my-banner')
      })

      setLoading(false)
    }, 3000)
  }, [])

  // It's a good idea to use an `id` that can't be easily detected as a banneable banner.
  // That way adblockers won't remove your fallback state too and you could show a custom
  // message in that case if the ad is blocked
  return (
    <div id="my-banner" style={{ ...props }}>
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

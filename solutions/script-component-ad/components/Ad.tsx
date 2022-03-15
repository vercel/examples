import React, { useEffect } from 'react'

export const AdBanner = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { googletag } = window
      console.log(googletag)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle adbanner-customize"
      style={{
        display: 'block',
      }}
      data-ad-client=""
      data-ad-slot="/6355419/Travel/Europe/France/Paris"
    />
  )
}

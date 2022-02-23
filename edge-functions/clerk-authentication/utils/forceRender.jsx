import React from 'react'

export const useForceRender = (delay = 1000) => {
  const [s, ss] = React.useState(0)
  const intervalIdRef = React.useRef(null)

  const stop = () => {
    const id = intervalIdRef.current
    if (id !== null) {
      clearInterval(id)
    }
  }

  React.useEffect(() => {
    intervalIdRef.current = setInterval(() => ss((state) => state + 1), delay)
    return stop
  }, [])

  return { stop }
}

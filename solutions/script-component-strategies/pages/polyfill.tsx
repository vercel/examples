import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { Layout, Page, Text } from '@vercel/examples-ui'

function Polyfill() {
  const ref = useRef<HTMLSpanElement>(null)
  const [lastIntersection, setIntersection] = useState(new Date())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (intersections) => {
        const isIntersecting = intersections[0]?.isIntersecting

        if (isIntersecting) {
          setIntersection(new Date())
        }
      },
      {
        rootMargin: '45px',
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* We ensure that intersection observer is available by polyfilling it */}
      <Script
        src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserverEntry%2CIntersectionObserver"
        strategy="beforeInteractive"
      />
      <Page>
        <section className="flex flex-col gap-6">
          <Text variant="h1">IntersectionObserver polyfill</Text>
          <Text>Scroll down to see when was the last intersection</Text>
        </section>
        <section
          className="flex items-center justify-center"
          style={{ height: '300vh' }}
        >
          <span ref={ref}>
            Last intersection at {lastIntersection.toTimeString()}
          </span>
        </section>
      </Page>
    </>
  )
}

Polyfill.Layout = Layout

export default Polyfill

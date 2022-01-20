import Script from 'next/script'
import { Layout, Page, Text } from '@vercel/examples-ui'
import { useEffect, useRef, useState } from 'react'

function CookieConsent() {
  const ref = useRef<HTMLDivElement>(null);
  const [isShown, toggle] = useState<boolean>(true)

  useEffect(() => {
    // This will be executed when loading the page
    if((window as any).cookieconsent) {
      initialize()
    }
  }, [])

  function initialize() {
    (window as any).cookieconsent.initialise({
      container: ref.current,
      palette:{
       popup: {background: "#fff"},
       button: {background: "#aa0000"},
      },
      revokable:true,
      onStatusChange: () => toggle(false),
      law: {
       regionalLaw: false,
      },
      location: true,
      content: {
        policy: 'Revoke consent'
      }
     });
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"
        strategy="beforeInteractive"
        // This will be executed when doing a client side transition to the page
        onLoad={initialize}
      />
      <Page>
        <section className="flex flex-col gap-6">
          <Text variant="h1">Cookie consent</Text>
          <Text>You should see a cookie consent banner below or a revoke consent button. It should dissapear once you accept and appear when you reload.</Text>
          {isShown && (
            <>
              <hr className="border-t border-accents-2" />
              <div ref={ref}></div>
            </>
          )}
        </section>
      </Page>
    </>
  )
}

CookieConsent.Layout = Layout;

export default CookieConsent;
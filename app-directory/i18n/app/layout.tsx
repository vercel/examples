import Nav from '@vercel/examples-ui/nav'
import Vercel from '@vercel/examples-ui/icons/vercel'

import '@vercel/examples-ui/globals.css'

interface Props {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  return (
    <html>
      <head />
      <body>
        <div className="mx-auto h-screen flex flex-col">
          <Nav path="app-directory/i18n" />
          <div className="px-8 bg-accents-0">
            <main>{children}</main>
            <footer className="py-10 w-full mt-auto border-t flex items-center justify-center bg-accents-1 z-20">
              <span className="text-primary">Created by</span>
              <a
                href="https://vercel.com"
                aria-label="Vercel.com Link"
                target="_blank"
                rel="noreferrer"
                className="text-black"
              >
                <Vercel
                  className="inline-block h-6 ml-3 text-primary"
                  alt="Vercel.com Logo"
                />
              </a>
            </footer>
          </div>
        </div>
      </body>
    </html>
  )
}

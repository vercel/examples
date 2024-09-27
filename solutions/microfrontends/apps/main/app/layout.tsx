import { Layout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body>
        <Layout title="Microfrontends" path="solutions/microfrontends">
          {children}
        </Layout>
      </body>
    </html>
  )
}

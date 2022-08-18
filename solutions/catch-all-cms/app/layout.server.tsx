/* eslint-disable @next/next/no-head-element */
import { Layout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function RootLayout({ children }) {
  return (
    <html className="this-is-the-document-html">
      <head>
        <title>Single Page CMS</title>
      </head>
      <body className="this-is-the-document-body">
        <Layout
          title="Pagination with SSG"
          path="solutions/pagination-with-ssg"
          description="Learn how to do pagination with SSG"
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}

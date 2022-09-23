/* eslint-disable @next/next/no-head-element */
import '@vercel/examples-ui/globals.css'
import type { FC, ReactNode } from 'react'

/**
 * This is our base Layout, only the html and body tags are added here, plus
 * global styles, everything else is added by pages and nested Layouts.
 */
const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <html>
    <head></head>
    <body>{children}</body>
  </html>
)

export default RootLayout

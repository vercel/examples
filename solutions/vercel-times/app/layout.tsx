import type { FC, ReactNode } from 'react'
import '../assets/main.css'

const Layout: FC<{ children: ReactNode }> = ({ children }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
)

export default Layout

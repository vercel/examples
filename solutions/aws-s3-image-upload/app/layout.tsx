import './globals.css'

export const metadata = {
  title: 'Next.js',
  description: 'AWS S3 Upload Example',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

import './globals.css'

export const metadata = {
  title: 'Waiting Room with Vercel KV for Redis',
  description: 'Add a virtual waiting room to your site.',
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

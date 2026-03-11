import './globals.css'

export const metadata = {
  title: 'LiteLLM Gateway on Vercel',
  description: 'A self-hosted AI gateway using LiteLLM and Vercel Services.',
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

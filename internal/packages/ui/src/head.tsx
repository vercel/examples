import NextHead from 'next/head.js'

export const Head = ({
  title,
  description,
}: {
  title?: string
  description?: string
}) => (
  <NextHead>
    {title && <title>{`${title} - Vercel Examples`}</title>}
    {description && <meta name="description" content={description} />}
    <link rel="icon" href="/favicon.ico" />
  </NextHead>
)

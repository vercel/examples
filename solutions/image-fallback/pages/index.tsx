import { Layout, Text, Page, Link, Code } from '@vercel/examples-ui'
import Image, { ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

import logo from '../public/logo.jpg'
import fallbackImage from '../public/fallback.jpg'

interface ImageWithFallbackProps extends ImageProps {
  fallback?: ImageProps['src']
}

const ImageWithFallback = ({
  fallback = fallbackImage,
  alt,
  src,
  ...props
}: ImageWithFallbackProps) => {
  const [error, setError] = useState<React.SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null)

  useEffect(() => {
    setError(null)
  }, [src])

  return (
    <Image
      alt={alt}
      onError={setError}
      src={error ? fallbackImage : src}
      {...props}
    />
  )
}

const Snippet: React.VFC<{ children: React.ReactChild }> = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

function Home() {
  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">Fallback images from next/image</Text>
        <Text>
          Broken images can break our users experience, managing error states
          gracefully lets us have more control over how our UI should look like
          if an unexpected action occur. Right now the{' '}
          <Link href="https://nextjs.org/docs/api-reference/next/image">
            <Code>next/image</Code>
          </Link>{' '}
          component does not implement a <Code>fallback</Code> property (but it
          might do it in the future), but we can implement it ourselves.
        </Text>
        <Snippet>{`const ImageWithFallback = ({
  fallback = fallbackImage,
  alt,
  src,
  ...props
}) => {
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
  }, [src])

  return (
    <Image
      alt={alt}
      onError={setError}
      src={error ? fallbackImage : src}
      {...props}
    />
  )
}`}</Snippet>
        <Text>
          Now we have a way of determine a <Code>fallback</Code> url for our
          images that will be used in case our original <Code>src</Code> fails
          to load.
        </Text>
        <article className="text-center flex flex-col sm:flex-row gap-12">
          <div className="m-auto">
            <ImageWithFallback
              width={200}
              height={200}
              src={logo}
              alt="Vercel logo"
            />
            <Text>This image should load correctly</Text>
          </div>
          <div className="m-auto">
            <ImageWithFallback
              width={200}
              height={200}
              layout="fixed"
              src="/failed.jpg"
              alt="Vercel logo"
            />
            <Text>This should not</Text>
          </div>
        </article>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text>
          We also ensure to reset the error everytime our <Code>src</Code>{' '}
          changes as changing it might solve the issue. You can also change the{' '}
          <Code>layout</Code> or <Code>width</Code> and <Code>height</Code>{' '}
          props when being in an error state if needed.
        </Text>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home

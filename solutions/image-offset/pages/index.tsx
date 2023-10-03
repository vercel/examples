import { memo, useCallback, useState } from 'react'
import Image, { type ImageProps, type StaticImageData } from 'next/image'
import { Layout, Text, Page, Code, Link } from '@vercel/examples-ui'

import logoBlack from '../public/logo.jpg'
import logoBlue from '../public/logo-blue.jpg'
import logoPink from '../public/logo-pink.jpg'
import logoGreen from '../public/logo-green.jpg'

interface ImageCardProps extends Omit<ImageProps, 'src' | 'onLoadingComplete'> {
  src: StaticImageData
  onLoadingComplete: (src: string) => void
}

const ImageCardWithOffset = memo<ImageCardProps>(function ImageCard({
  onLoadingComplete,
  src,
  alt,
  ...props
}) {
  return (
    <div className="shadow bg-white rounded h-64 w-64 relative">
      <Image
        {...props}
        src={src}
        alt={alt}
        onLoadingComplete={() => onLoadingComplete(src.src)}
      />
    </div>
  )
})

function Home() {
  const [loaded, setLoaded] = useState<string[]>([])

  const handleLoaded = useCallback(
    (color: string) => setLoaded((loaded) => loaded.concat(color)),
    []
  )

  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">next/image offset loading</Text>
        <Text>This example shows how lazy loading works on next/image.</Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">Priority</Text>
        <Text>
          When using the{' '}
          <Link href="https://nextjs.org/docs/api-reference/next/image#priority">
            <Code>priority</Code>
          </Link>{' '}
          prop the image will be considered high priority and preload. Lazy
          loading is automatically disabled for images using priority.
        </Text>
        <div className="shadow bg-white rounded h-64 w-64 relative">
          <Image priority src={logoBlack} alt="Vercel logo" />
        </div>
        <Text className="text-gray-500 border-l-4 pl-2">
          This image has <Code>priority</Code> so it has been preloaded.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">Loading</Text>
        <Text>
          Images are lazy loaded by default when using next/image, this means
          that the image won&apos;t be loaded until they are about to enter the
          viewport.
        </Text>
        <div className="shadow bg-white rounded h-64 w-64 relative">
          <Image loading="eager" src={logoBlack} alt="Vercel logo" />
        </div>
        <Text className="text-gray-500 border-l-4 pl-2">
          This image has <Code>loading=&quot;eager&quot;</Code> so it has been
          loaded immediately.
        </Text>
        <div className="shadow bg-white rounded h-64 w-64 relative">
          <Image src={logoBlack} alt="Vercel logo" />
        </div>
        <Text className="text-gray-500 border-l-4 pl-2">
          This image has <Code>loading=&quot;lazy&quot;</Code> (default) so it
          has been lazy loaded.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">Lazy boundary</Text>
        <Text>
          Images will start loading when the{' '}
          <Link href="https://nextjs.org/docs/api-reference/next/image#lazyboundary">
            <Code>lazyBoundary</Code>
          </Link>{' '}
          is crossed (defaults to <Code>200px</Code>). We will demo this with a
          few images with different <Code>lazyBoundary</Code> values. Each image
          will have a <Code>100vh</Code> margin so you will have to scroll.
        </Text>
        <article className="shadow bg-white rounded sticky top-0 p-4 z-10">
          <Text>
            <span className="font-medium mr-2">Blue logo:</span>
            <span className="text-sm mr-2">(200px offset)</span>
            {loaded.includes(logoBlue.src) ? (
              <span role="img">✅</span>
            ) : (
              <span role="img">🕓</span>
            )}
          </Text>
          <Text>
            <span className="font-medium mr-2">Pink logo:</span>
            <span className="text-sm mr-2">(100px offset)</span>
            {loaded.includes(logoPink.src) ? (
              <span role="img">✅</span>
            ) : (
              <span role="img">🕓</span>
            )}
          </Text>
          <Text>
            <span className="font-medium mr-2">Green logo:</span>
            <span className="text-sm mr-2">(20px offset)</span>
            {loaded.includes(logoGreen.src) ? (
              <span role="img">✅</span>
            ) : (
              <span role="img">🕓</span>
            )}
          </Text>
        </article>
        <article className="h-screen flex items-center justify-center flex-col gap-3">
          <ImageCardWithOffset
            onLoadingComplete={handleLoaded}
            src={logoBlue}
            alt="Vercel logo"
            lazyBoundary="200px"
          />
          <Text className="text-gray-500">
            This image has <Code>lazyBoundary=&quot;200px&quot;</Code>
          </Text>
        </article>
        <article className="h-screen flex items-center justify-center flex-col gap-3">
          <ImageCardWithOffset
            onLoadingComplete={handleLoaded}
            src={logoPink}
            alt="Vercel logo"
            lazyBoundary="100px"
          />
          <Text className="text-gray-500">
            This image has <Code>lazyBoundary=&quot;100px&quot;</Code>
          </Text>
        </article>
        <article className="h-screen flex items-center justify-center flex-col gap-3">
          <ImageCardWithOffset
            onLoadingComplete={handleLoaded}
            src={logoGreen}
            alt="Vercel logo"
            lazyBoundary="20px"
          />
          <Text className="text-gray-500">
            This image has <Code>lazyBoundary=&quot;20px&quot;</Code>
          </Text>
        </article>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home

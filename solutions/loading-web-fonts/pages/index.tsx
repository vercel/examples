import Head from 'next/head'
import Image from 'next/image'
import {
  Layout,
  Text,
  Page,
  Code,
  Link,
  List,
  Snippet,
} from '@vercel/examples-ui'
import { useState } from 'react'

import displayAuto from '../public/display-auto.jpg'
import displaySwap from '../public/display-swap.jpg'
import displayOptional from '../public/display-optional.jpg'

interface FontMixerProps {
  fonts: [string, string]
  children: string
}

const FontMixer: React.VFC<FontMixerProps> = ({ fonts: [a, b], children }) => {
  const [fader, setFader] = useState(0)

  return (
    <section className="flex flex-col items-center gap-6">
      <section className="flex gap-6 relative h-[320px] w-[100%] border border-gray-200 leading-6">
        <article
          className="p-4 absolute h-[320px] text-ellipsis overflow-hidden text-blue-500"
          style={{
            fontFamily: a,
            width: '50%',
            left: `${fader}%`,
            filter: `grayscale(${1 - fader / 25})`,
          }}
        >
          {children}
        </article>
        <article
          className="p-4 absolute h-[320px] text-ellipsis overflow-hidden text-pink-500"
          style={{
            fontFamily: b,
            width: '50%',
            right: `${fader}%`,
            filter: `grayscale(${1 - fader / 25})`,
          }}
        >
          {children}
        </article>
      </section>
      <input
        value={fader}
        min={0}
        max={25}
        onChange={(e) => setFader(Number(e.target.value))}
        className="w-[50%]"
        type="range"
      />
    </section>
  )
}

function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <Head>
        <title>Loading web fonts - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example on how to load web fonts"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Loading web fonts</Text>
        <Text>
          Custom fonts within our application loads once the CSS evaluation
          completes, if it determines that its actually used on the page. We can
          ask the browser to start loading them as soon as it discovers the
          element, using a <Code>link rel=&quot;preload&quot;</Code> element.
        </Text>
        <Snippet>{`<link
  rel="preload"
  href="/fonts/Inter-Bold.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>`}</Snippet>
        <Text className="border-l-4 pl-4">
          If we use <Code>Google Fonts</Code> or <Code>Typekit</Code>,{' '}
          <Link href="https://nextjs.org/docs/basic-features/font-optimization">
            Next.js Font Optimization
          </Link>{' '}
          will automatically add the preconnect link.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">We are still not covered</Text>
        <Text>
          Althought now our fonts are being loaded, they will not be loaded
          immediatly. We have a timespan between the font being requested and
          the font being loaded, that may vary depending on the size of the
          fonts, the network speed and more.
        </Text>
        <Text>
          During this timespan our text will be displayed with a fallback font
          or with no font at all depending on the <Code>font-display</Code>{' '}
          strategy we have defined.
        </Text>
        <Text>
          Based on the visual differences between our custom font and the
          determined fallback font, we may introduce a layout shift (which is an
          important metric for Google Core Web Vitals) in our application.
        </Text>
        <FontMixer fonts={['Arial', 'Times New Roman']}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          convallis mauris dui, non placerat urna fringilla at. Suspendisse a
          orci quis arcu tristique sagittis at sed leo. Nam quis neque dapibus,
          semper nisl non, lacinia ligula. Duis viverra a nisl ut consectetur.
          Ut elementum fringilla odio viverra egestas. Morbi aliquet lorem
          lorem, in suscipit nibh tempus quis. Mauris gravida dapibus odio,
          vitae interdum lectus pretium ut. Vivamus tincidunt laoreet
          pellentesque. Praesent tincidunt elementum tempus.
        </FontMixer>
        <Text>
          Fonts with different sizes not only may create a layout shift in its
          space but could also push or pull content around it creating a bigger
          shift in the UI.
        </Text>
        <Text>
          One possible solution is having an adjusted fallback font that tries
          to match the used space of our custom font to reduce the layout shift.
          You can use{' '}
          <Link href="https://www.industrialempathy.com/perfect-ish-font-fallback/?font=Inter">
            this tool
          </Link>{' '}
          to find which fallback font might match your custom font.
        </Text>
        <Text>
          Here we can see the difference that using an adjusted fallback font
          makes:
        </Text>
        <FontMixer fonts={['Inter', 'Inter-fallback']}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          convallis mauris dui, non placerat urna fringilla at. Suspendisse a
          orci quis arcu tristique sagittis at sed leo. Nam quis neque dapibus,
          semper nisl non, lacinia ligula. Duis viverra a nisl ut consectetur.
          Ut elementum fringilla odio viverra egestas. Morbi aliquet lorem
          lorem, in suscipit nibh tempus quis. Mauris gravida dapibus odio,
          vitae interdum lectus pretium ut. Vivamus tincidunt laoreet
          pellentesque. Praesent tincidunt elementum tempus.
        </FontMixer>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Font display</Text>
        <Text>
          As we mentioned above, during the timespan between our page displaying
          text before loading our custom font and our custom font being applied
          to that text, we can use several strategies that will determine how
          that text will be displayed. For changing this behaviour we can use
          the CSS property <Code>font-display</Code>.
        </Text>
        <List>
          <li>
            <Image src={displayAuto} alt="font-display: auto" />
            <Code>font-display: auto</Code>: This is the default setting for{' '}
            <Code>font-display</Code>. It will make the text invisible while the
            custom is being loaded, the space reserved depends on the space that
            the fallback font configured would have taken to fill show that
            text.
          </li>
          <li>
            <Image src={displaySwap} alt="font-display: swap" />
            <Code>font-display: swap</Code>: Will display the text using the
            fallback font until our custom font is loaded and will then swap the
            fallback font with the custom font.
          </li>
          <li>
            <Image src={displayOptional} alt="font-display: optional" />
            <Code>font-display: optional</Code>: Will only display the custom
            font if it is available really fast, it mostly requires it being
            cached so the user will see the fallback font during its first visit
            but will see the custom font from the beginning on subsequent
            visits.
          </li>
        </List>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Useful links</Text>
        <Text>
          If you want to know more about loading web fonts you can refer to{' '}
          <Link href="https://www.industrialempathy.com/posts/high-performance-web-font-loading/">
            this post
          </Link>{' '}
          by Malte Ubl and also to the{' '}
          <Link href="https://developer.mozilla.org/es/docs/Web/CSS/@font-face/font-display">
            MDN documentation
          </Link>{' '}
          of <Code>font-display</Code>.
        </Text>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home

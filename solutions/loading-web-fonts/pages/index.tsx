import Image from 'next/image'
import { Layout, Text, Page, Code, Link, Snippet } from '@vercel/examples-ui'
import displayAuto from '../public/display-auto.jpg'
import displaySwap from '../public/display-swap.jpg'
import displayOptional from '../public/display-optional.jpg'
import FontMixer from '../components/FontMixer'

function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Loading Web Fonts</Text>
        <Text>
          Custom fonts within our application load once the CSS evaluation
          completes, if the browser determines that its actually used on the
          page. We can ask the browser to start loading them as soon as it
          discovers the element, using a <Code>link</Code> with{' '}
          <Code>rel=&quot;preload&quot;</Code>.
        </Text>
        <Snippet>{`<link
  rel="preload"
  href="/fonts/Inter-Bold.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>`}</Snippet>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">We are still not covered</Text>
        <Text>
          Although now our fonts are being preloaded, they will not load
          immediately. We have a timespan between the font being requested and
          the font being loaded, that may vary depending on the size of the
          fonts, the network speed and more.
        </Text>
        <Text>
          During this timespan our text will be displayed with a fallback font
          or with no font at all depending on the <Code>font-display</Code>{' '}
          strategy we have defined (more about this in <i>Font Display</i>).
        </Text>
        <Text>
          Based on the visual differences between our custom font and the
          determined fallback font, we may introduce a layout shift (which is an
          important metric for Google Core Web Vitals) in our application, as
          seen in the example below:
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
          Fonts with different sizes may create a layout shift in its space and
          may also push or pull content around it creating a bigger shift in the
          UI.
        </Text>
        <Text>
          One possible solution is having an adjusted fallback font that tries
          to match the used space of our custom font to reduce the layout shift.
          You can use{' '}
          <Link
            href="https://www.industrialempathy.com/perfect-ish-font-fallback/?font=Inter"
            target="_blank"
          >
            this tool
          </Link>{' '}
          to find which fallback font might match your custom font and set the
          correspondant <Code>line-height</Code> to it so it adjust accordingly.
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
        <Text variant="h2">Font Display</Text>
        <Text>
          As we mentioned above, during the timespan between our page displaying
          text and our custom font being applied to that text, we can choose one
          of several behaviors that will determine how that text will be
          displayed, using the <Code>font-display</Code> CSS property.
        </Text>

        <hr className="border-t border-accents-2 my-6" />

        <article>
          <Image src={displayAuto} alt="font-display: auto" />
          <Code>font-display: auto</Code>: This is the default value of{' '}
          <Code>font-display</Code>. The text will be invisible while the custom
          font is loading, the reserved space depends on the space that would
          have been occupied by the fallback font.
        </article>

        <hr className="border-t border-accents-2 my-6" />

        <article>
          <Image src={displaySwap} alt="font-display: swap" />
          <Code>font-display: swap</Code>: The browser will display the text
          using the fallback font while the custom font loads and then swap the
          fonts once it has finished loading.
        </article>

        <hr className="border-t border-accents-2 my-6" />

        <article>
          <Image src={displayOptional} alt="font-display: optional" />
          <Text>
            <Code>font-display: optional</Code>: The browser will only display
            the custom font if it is available before it has to start rendering
            text. If the font is cached it&apos;ll be less likely for users to
            see the fallback font on subsequent visits.
          </Text>
          <Text className="mt-4">
            Layout shifts are reduced by using this strategy, as the browser
            won&apos;t swap the fonts after rendering the page with the fallback
            font.
          </Text>
          <Text className="border-l-4 pl-4 mt-4">
            If you don&apos;t add a <Code>link</Code> with{' '}
            <Code>rel=&quot;preload&quot;</Code> for this font (which triggers a
            special heuristic) it&apos;ll never be shown in the first page load
            unless it is in memory cache, even if it is in disk cache.
          </Text>
        </article>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Learn More</Text>
        <Text>
          If you want to know more about loading web fonts you can refer to{' '}
          <Link
            href="https://www.industrialempathy.com/posts/high-performance-web-font-loading/"
            target="_blank"
          >
            this post about font loading
          </Link>{' '}
          by{' '}
          <Link href="https://twitter.com/cramforce" target="_blank">
            Malte Ubl
          </Link>{' '}
          and also to the{' '}
          <Link
            href="https://developer.mozilla.org/es/docs/Web/CSS/@font-face/font-display"
            target="_blank"
          >
            MDN documentation font-display
          </Link>
          .
        </Text>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home

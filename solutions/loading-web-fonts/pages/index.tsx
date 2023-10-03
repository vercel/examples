import Image from 'next/image'
import { Layout, Text, Page, Code, Link, Snippet } from '@vercel/examples-ui'
import displayAuto from '../public/display-auto.jpg'
import displaySwap from '../public/display-swap.jpg'
import displayOptional from '../public/display-optional.jpg'
import FontMixer from '../components/FontMixer'
import inter from '../lib/inter'

function Home() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Loading Web Fonts
      </Text>
      <Text className="mb-4">
        Custom fonts within our application load once the CSS evaluation
        completes, with Next.js Font Optimization we can tell the browser which
        fonts to use for the page in a secure way, preload them, and avoid the
        common performance issues of adding custom fonts.
      </Text>
      <Snippet className="mb-4">{`import { Inter } from '@next/font/google'

const inter = Inter({
  variable: '--inter-font',
})

<div className={inter.className}>
  ...
</div>`}</Snippet>

      <section className="flex flex-col gap-4">
        <Text>
          Although now our fonts are being preloaded, they will not load
          immediately. We have a timespan between the font being requested and
          the font being loaded, that may vary depending on the size of the
          fonts, the network speed and more.
        </Text>
        <Text>
          During this timespan our text will be displayed with a fallback font
          or with no font at all depending on the{' '}
          <Link
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display"
            target="_blank"
          >
            <Code>font-display</Code>
          </Link>{' '}
          strategy we have defined (more about this in <i>`Font Display`</i>{' '}
          below), by default Next.js will use{' '}
          <Code>font-display: optional</Code> and it can be customized with the{' '}
          <Link
            href="https://nextjs.org/docs/api-reference/next/font#display"
            target="_blank"
          >
            <Code>display</Code>
          </Link>{' '}
          prop.
        </Text>
        <Text>
          Based on the visual differences between our custom font and the
          determined fallback font, we may introduce a layout shift (which is an
          important metric for Google Core Web Vitals) in our application, as
          seen in the example below that compares <Code>Arial</Code> (left) with{' '}
          <Code>Times New Roman</Code> (right):
        </Text>
        <FontMixer
          fonts={[
            { style: { fontFamily: 'Arial' } },
            { style: { fontFamily: 'Times New Roman' } },
          ]}
        >
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
          One solution is having an adjusted fallback font that tries to match
          the used space of our custom font to reduce the layout shift. Next.js
          automatically adds a fallback font that matches your custom font, and
          you can also do it manually with{' '}
          <Link
            href="https://www.industrialempathy.com/perfect-ish-font-fallback/?font=Inter"
            target="_blank"
          >
            this tool
          </Link>
          .
        </Text>
        <Text>
          Here we can see the difference that using an adjusted fallback font
          makes, in a comparison between the <Code>Inter</Code> font (left) and
          a custom
          <Code>Inter-fallback</Code> font (right) which is <Code>Arial</Code>{' '}
          with{' '}
          <Link
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust"
            target="_blank"
          >
            <Code>size-adjust</Code>
          </Link>{' '}
          set to <b>107%</b>:
        </Text>
        <FontMixer
          fonts={[
            { className: inter.className },
            { style: { fontFamily: 'Inter-fallback' } },
          ]}
        >
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

      <section className="flex flex-col gap-4">
        <Text variant="h2" className="mb-2 mt-12">
          Font Display
        </Text>
        <Text>
          As we mentioned above, during the timespan between our page displaying
          text and our custom font being applied to that text, we can choose one
          of several behaviors that will determine how that text will be
          displayed, using the{' '}
          <Link
            href="https://nextjs.org/docs/api-reference/next/font#display"
            target="_blank"
          >
            <Code>display</Code>
          </Link>{' '}
          prop.
        </Text>

        <hr className="border-t border-accents-2 mt-4" />

        <article>
          <Image src={displayOptional} alt="font-display: optional" />
          <Text>
            <Code>display: &apos;optional&apos;</Code>: The browser will only
            display the custom font if it is available before it has to start
            rendering text. If the font is cached it&apos;ll be less likely for
            users to see the fallback font on subsequent visits.
          </Text>
          <Text className="mt-4">
            Layout shifts are reduced by using this strategy, as the browser
            won&apos;t swap the fonts after rendering the page with the fallback
            font. When the fonts are similar enough, this is is the best
            strategy for a better UX.
          </Text>
          <Text className="border-l-4 pl-4 mt-4">
            If you disable{' '}
            <Link
              href="https://nextjs.org/docs/api-reference/next/font#preload"
              target="_blank"
            >
              <Code>preload</Code>
            </Link>{' '}
            (which triggers a special heuristic and is enabled by default) the
            font will never be shown in the first page load unless it is in
            memory cache, even if it is in disk cache.
          </Text>
        </article>

        <hr className="border-t border-accents-2 mt-4" />

        <article>
          <Image src={displayAuto} alt="font-display: auto" />
          <Code>display: &apos;block&apos;</Code>: The text will be invisible
          while the custom font is loading, the reserved space depends on the
          space that would have been occupied by the fallback font.
        </article>

        <hr className="border-t border-accents-2 mt-4" />

        <article>
          <Image src={displaySwap} alt="font-display: swap" />
          <Code>display: &apos;swap&apos;</Code>: The browser will display the
          text using the fallback font while the custom font loads and then swap
          the fonts once it has finished loading.
        </article>
      </section>

      <Text variant="h2" className="mb-6 mt-12">
        Learn More
      </Text>
      <Text>
        If you want to know more about loading web fonts you can refer to the
        official docs for{' '}
        <Link
          href="https://nextjs.org/docs/basic-features/font-optimization"
          target="_blank"
        >
          Next.js Font Optimization
        </Link>
        , the API docs for{' '}
        <Link
          href="https://nextjs.org/docs/api-reference/next/font"
          target="_blank"
        >
          @next/font
        </Link>{' '}
        and{' '}
        <Link
          href="https://www.industrialempathy.com/posts/high-performance-web-font-loading/"
          target="_blank"
        >
          this post about font loading
        </Link>{' '}
        by{' '}
        <Link href="https://twitter.com/cramforce" target="_blank">
          Malte Ubl
        </Link>
        .
      </Text>
    </Page>
  )
}

Home.Layout = Layout

export default Home

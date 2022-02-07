import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Head from 'next/head'

import cs from '@lib/contentstack'
import { Layout, Link, Page } from '@vercel/examples-ui'
import Container from '@components/ui/Container'
import UIComponent from '@components/ui/UIComponent'
import Navbar from '@components/ui/Navbar'
import Footer from '@components/ui/Footer'
import type { UIComponentEntity } from '@components/ui/UIComponent'
import type { HeaderEntity } from '@components/ui/Navbar/Navbar'
import { defatultPageProps } from '@lib/defaults'
interface PageProps {
  title: string
  seo: Record<string, string>
  blocks: UIComponentEntity[]
  header: HeaderEntity
  locale: string
}
export async function getStaticProps({
  locale: nextLocale,
  locales,
}: GetStaticPropsContext): Promise<
  GetStaticPropsResult<PageProps> | undefined
> {
  try {
    const page = await cs.getEntryWithAssets(
      'home_page',
      'blt5c760b6ce70ae18b',
      nextLocale ? (nextLocale.toLocaleLowerCase() as string) : 'en-US'
    )

    return {
      props: {
        ...defatultPageProps,
        ...page,
      },
      revalidate: 1,
    }
  } catch (err) {
    console.error(err)
  }
}

function Home({
  title,
  seo,
  locale,
  blocks = [],
  header = { links: [] },
}: PageProps) {
  return (
    <>
      <Head>
        <title>
          {title} - ContentStack Commerce Demo using Next.js and Vercel
        </title>
        <meta
          name="description"
          content="ContentStack Commerce Demo using Next.js and Vercel"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Navbar data={header} />
        {blocks.map(({ component }, i) => {
          const { component_type, component_variant, ...rest } = component
          return (
            <UIComponent
              key={`${component_type}_${i}`}
              componentType={component_type}
              componentVariant={component_variant}
              data={rest}
              priority={i < 3}
            />
          )
        })}
      </Container>
      <Footer pages={[]} />
    </>
  )
}

Home.Layout = Layout

export default Home

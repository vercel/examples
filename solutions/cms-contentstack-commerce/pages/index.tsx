import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Head from 'next/head'

import cs from '@lib/contentstack'
import { Layout, Link, Page } from '@vercel/examples-ui'
import Container from '@components/ui/Container'
import UIComponent from '@components/ui/UIComponent'
import Navbar from '@components/ui/Navbar'
import Footer from '@components/ui/Footer'
import type { UIComponentEntity } from '@components/ui/UIComponent'

interface PageProps {
  title: string
  seo: Record<string, string>
  blocks: UIComponentEntity[]
  header: HeaderEntity[]
  locale: string
}

interface HeaderEntity {
  links: Link[]
}

interface Link {
  title: string
  url: string
}

export async function getStaticProps({
  locale: nextLocale,
  locales,
}: GetStaticPropsContext): Promise<
  GetStaticPropsResult<PageProps> | undefined
> {
  const page = await cs.getEntryWithAssets(
    'home_page',
    'blt5c760b6ce70ae18b',
    nextLocale?.toLocaleLowerCase() as string
  )

  return {
    props: {
      ...page,
    },
    revalidate: 1,
  }
}

function Home({ title, seo, locale, blocks = [], header }: PageProps) {
  return (
    <Page className="max-w-5xl">
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
    </Page>
  )
}

Home.Layout = Layout

export default Home

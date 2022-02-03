import type {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Head from 'next/head'
import * as Contentstack from 'contentstack'
import { Layout, Text, Page, Code, Link, List } from '@vercel/examples-ui'
import { defatultPageProps } from '@lib/defaults'
import Container from '@components/ui/Container'
import UIComponent from '@components/ui/UIComponent'
import type { UIComponentEntity } from '@components/ui/UIComponent'
import cs from '@lib/contentstack'

interface PageProps {
  locale: string
  seo: Record<string, string>
  blocks: UIComponentEntity[]
  header: HeaderEntity[]
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
  const { modular_blocks } = await cs.getEntryWithAssets(
    'home_page',
    'blt5c760b6ce70ae18b',
    nextLocale?.toLocaleLowerCase() as string
  )

  console.log('blocks', modular_blocks)

  return {
    props: {
      blocks: modular_blocks,
    },
    revalidate: 1,
  }
}

function Home({ title, seo, locale, blocks = [] }: PageProps) {
  return (
    <Page>
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
    </Page>
  )
}

Home.Layout = Layout

export default Home

import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Head from 'next/head'
import cs from '@lib/contentstack'
import { Navbar, Footer, UIComponent, Container } from '@components/ui'

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<
  GetStaticPropsResult<Entry | null> | undefined
> {
  try {
    const entry = await cs.getEntry(
      // hardcoded example
      'home_page',
      'blt5c760b6ce70ae18b',
      locale ? (locale.toLocaleLowerCase() as string) : 'en-US'
    )

    if (entry) {
      return {
        props: {
          ...entry,
        },
        revalidate: 1,
      }
    }

    throw new Error('Entry is not valid')
  } catch (err) {
    console.error(err)
  }
}

function Index(props: Entry) {
  const { title, seo, modular_blocks = [], header = { links: [] } } = props
  const _title = `${seo.title ? seo.title : title} - ${seo.description}`

  return (
    <>
      <Head>
        <title>{_title}</title>
        <meta name="description" content={seo.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Navbar data={header} />
        {modular_blocks.map(({ component }, i) => {
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
      <Footer />
    </>
  )
}

export default Index

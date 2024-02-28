import type { Metadata } from 'next'
import { getEntry } from '@lib/contentstack'
import { Navbar } from '@components/ui/navbar'
import { Footer } from '@components/ui/footer'
import { UIComponent } from '@components/ui/ui-component'
import { Container } from '@components/ui/container'

type Props = {
  params: { lang: string }
}

async function getHomeEntry(locale: string) {
  const entry = await getEntry(
    {
      contentType: 'home_page',
      entryId: 'blt5c760b6ce70ae18b',
      locale,
    },
    {
      next: { revalidate: 3600 }, // revalidate every hour
    }
  )
  if (!entry) throw new Error('Home entry not found')
  return entry
}

export async function generateMetadata({
  params: { lang },
}: Props): Promise<Metadata> {
  const { seo, title } = await getHomeEntry(lang)
  return {
    title: `${seo.title ? seo.title : title} - ${seo.description}`,
    description: seo.description,
  }
}

async function Page({ params: { lang } }: Props) {
  const entry = await getHomeEntry(lang)
  return (
    <>
      <Container>
        <Navbar data={entry.header} />
        {entry.modular_blocks.map(({ component }, i) => {
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

export default Page

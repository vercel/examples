import frontMatter from 'front-matter'
import getRelatedTemplates from './get-related-templates'
import type { Template } from './types'

interface Attributes extends Omit<Template, 'relatedTemplates'> {
  marketplace: boolean
  useCase?: string[]
  relatedTemplates: string[]
}

const toArray = (val: string | string[]) =>
  typeof val === 'string' ? [val] : val ?? []

export default async function getTemplate(readme: string) {
  const { body, attributes } = frontMatter<Attributes>(readme)

  if (attributes.marketplace === false) {
    return { body }
  }

  const relatedTemplates = await getRelatedTemplates(
    toArray(attributes.relatedTemplates)
  )
  const template: Template = {
    name: attributes.name,
    slug: attributes.slug,
    description: attributes.description,
    framework: toArray(attributes.framework),
    type: toArray(attributes.useCase || attributes.type),
    css: toArray(attributes.css),
    githubUrl: attributes.githubUrl,
    deployUrl: attributes.deployUrl,
    demoUrl: attributes.demoUrl,
    publisher: attributes.publisher ?? '▲ Vercel',
    relatedTemplates: relatedTemplates.map(({ sys }: any) => ({
      sys: {
        id: sys.id,
        type: 'Link',
        linkType: 'Entry',
      },
    })),
  }

  return { body, template }
}

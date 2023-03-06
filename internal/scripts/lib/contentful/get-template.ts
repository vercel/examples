import frontMatter from 'front-matter'
import getRelatedTemplates from './get-related-templates'
import type { ContentfulTemplate, Template } from './types'

interface Attributes extends Omit<Template, 'relatedTemplates'> {
  lang?: 'en-US'
  marketplace?: boolean
  useCase?: string[]
  relatedTemplates?: string[]
}

// This is used for the template object that's created below where every field is defined
// but the value can be undefined.
type TemplateFields = {
  [P in keyof ContentfulTemplate]: Template[P]
}

const toArray = (val?: string | string[]) =>
  typeof val === 'string' ? [val] : val ?? []

export default async function getTemplate(readme: string) {
  const { body, attributes } = frontMatter<Attributes>(readme)
  const { lang = 'en-US' } = attributes

  if (lang !== 'en-US') {
    throw new Error('Only English templates are supported for now.')
  }

  if (attributes.marketplace === false) {
    return { body, lang }
  }

  const relatedTemplates = await getRelatedTemplates(
    toArray(attributes.relatedTemplates)
  )
  const template: TemplateFields = {
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
    overview: undefined,
    relatedTemplates: attributes.relatedTemplates?.map((slug) => {
      const template = relatedTemplates.find(
        (t: any) => t.fields.slug[lang] === slug
      )

      if (!template) {
        throw new Error(
          `An existing template with the slug "${slug}" was not found.`
        )
      }

      return {
        sys: {
          id: template.sys.id,
          type: 'Link',
          linkType: 'Entry',
        },
      }
    }),
  }

  return { body, lang, template }
}

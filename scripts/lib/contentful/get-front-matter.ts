import frontMatter from 'front-matter'
import type { Template } from './types'

interface Attributes extends Template {
  marketplace: boolean
  useCase: string[]
}

export default function getFrontMatter(readme: string) {
  const { body, attributes: attrs } = frontMatter<Attributes>(readme)

  if (attrs.marketplace === false) {
    return { body }
  }

  const attributes: Partial<Template> = {
    name: attrs.name,
    slug: attrs.slug,
    description: attrs.description,
    framework: ([] as string[]).concat(attrs.framework),
    type: ([] as string[]).concat(attrs.useCase || attrs.type),
    css: ([] as string[]).concat(attrs.css),
    deployUrl: attrs.deployUrl,
    demoUrl: attrs.demoUrl,
    publisher: attrs.publisher ?? '▲ Vercel',
  }

  return { body, attributes }
}

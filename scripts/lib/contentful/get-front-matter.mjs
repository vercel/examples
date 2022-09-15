import frontMatter from 'front-matter'

export default function getFrontMatter(readme, examplePath) {
  const { body, attributes: attrs } = frontMatter(readme)

  if (attrs.marketplace === false) {
    return { body }
  }

  const attributes = {
    name: attrs.name,
    slug: attrs.slug,
    description: attrs.description,
    framework: [].concat(attrs.framework),
    type: [].concat(attrs.useCase || attrs.type),
    css: [].concat(attrs.css),
    deployUrl: attrs.deployUrl,
    demoUrl: attrs.demoUrl,
    publisher: attrs.publisher ?? '▲ Vercel',
  }

  return { body, attributes }
}

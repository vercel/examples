import frontMatter from 'front-matter'

const FRAMEWORKS = ['Next.js', 'None']
const USE_CASES = ['Edge Functions', 'Documentation', 'Starter']
const CSS = ['Tailwind', 'CSS Modules', 'CSS-in-JSX', 'CSS']

export default function getTemplate(readme, examplePath) {
  const { body, attributes } = frontMatter(readme)

  if (attributes.marketplace === false) {
    return { body }
  }

  const template = {
    name: attributes.name,
    slug: attributes.slug,
    description: attributes.description,
    framework: [].concat(attributes.framework),
    useCase: [].concat(attributes.useCase),
    css: [].concat(attributes.css),
    deployUrl: attributes.deployUrl,
    demoUrl: attributes.demoUrl,
    publisher: attributes.publisher ?? '▲ Vercel',
  }

  for (const field of Object.keys(template)) {
    // Right now all fields are required
    if (!template[field]?.length) {
      throw new Error(
        `Missing required template fields for ${examplePath}:
        ${JSON.stringify(template, null, 2)}
        `
      )
    }
  }

  if (!template.framework.every((val) => FRAMEWORKS.includes(val))) {
    throw new Error(
      `The framework "${template.framework.join(', ')}" is not supported.
      Supported frameworks: ${FRAMEWORKS.join(', ')}`
    )
  }
  if (!template.useCase.every((val) => USE_CASES.includes(val))) {
    throw new Error(
      `The use case "${template.useCase.join(', ')}" is not supported.
      Supported use cases: ${USE_CASES.join(', ')}`
    )
  }
  if (!template.css.every((val) => CSS.includes(val))) {
    throw new Error(
      `The CSS option "${template.css.join(', ')}" is not supported.
      Supported CSS options: ${CSS.join(', ')}`
    )
  }

  template.type = template.useCase
  delete template.useCase

  return { template, body }
}

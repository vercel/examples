import frontMatter from 'front-matter'

const FRAMEWORKS = ['Next.js']
const USE_CASES = ['Edge Functions']
const CSS = ['Tailwind']

export default function getTemplate(readme) {
  const { attributes } = frontMatter(readme)
  const {
    name,
    slug,
    description,
    framework,
    useCase,
    css,
    demoUrl,
    publisher = '▲ Vercel',
  } = attributes

  if (
    !name ||
    !slug ||
    !description ||
    !framework ||
    !useCase ||
    !css ||
    !demoUrl
  ) {
    throw new Error(
      `Missing required template fields:
      {
        name: ${name}
        slug: ${slug}
        description: ${description}
        framework: ${framework}
        use case: ${useCase}
        css: ${css}
        demoUrl: ${demoUrl}
      }
      `
    )
  }
  if (!FRAMEWORKS.includes(framework)) {
    throw new Error(
      `The framework "${framework}" is not supported.
      Supported frameworks: ${FRAMEWORKS.join(', ')}`
    )
  }
  if (!USE_CASES.includes(useCase)) {
    throw new Error(
      `The use case "${useCase}" is not supported.
      Supported use cases: ${USE_CASES.join(', ')}`
    )
  }
  if (!CSS.includes(css)) {
    throw new Error(
      `The CSS option "${css}" is not supported.
      Supported CSS options: ${CSS.join(', ')}`
    )
  }

  return {
    name,
    slug,
    description,
    framework,
    type: useCase,
    css,
    demoUrl,
    publisher,
  }
}

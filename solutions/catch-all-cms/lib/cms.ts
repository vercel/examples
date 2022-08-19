type Page = {
  components: { name: string }[]
}

type Variants = Record<string, Page>

const components = ['A']
const variants = components.reduce<Variants>((acc, name) => {
  acc[`/${name.toLowerCase()}`] = {
    components: [{ name }],
  }
  return acc
}, {})

console.log('s', variants)

// All methods are async as this is trying to look like a third party service
const cms = {
  async getComponentsByPage() {},
  async getPageBySlug(slug: string) {
    return variants[slug]
  },
  async getAllPages() {
    return variants
  },
}

export default cms

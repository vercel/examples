import routes from './routes'

// All methods are async as a real app would likely fetch from a third party service.
const cms = {
  async getRouteBySlug(slug: string) {
    return routes[slug]
  },
  async getLayoutBySlug(slug: string) {
    return this.getRouteBySlug(slug).then((v) => v?.layout)
  },
  async getPageBySlug(slug: string) {
    return this.getRouteBySlug(slug).then((v) => v?.page)
  },
  async getAllRoutes() {
    return routes
  },
}

export default cms

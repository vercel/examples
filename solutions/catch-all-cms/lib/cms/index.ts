import { routes, layouts } from './routes'

// All methods are async as a real app would likely fetch from a third party service.
const cms = {
  async getRouteBySlug(slug: string) {
    return routes[slug]
  },
  async getLayoutByName(name: string) {
    return layouts[name]
  },
  async getPageBySlug(slug: string) {
    return routes[slug]
  },
  async getAllRoutes() {
    return routes
  },
}

export default cms

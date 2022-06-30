const hostnamesDB = [
  {
    name: 'Site 1',
    description: 'Subdomain + custom domain',
    subdomain: 'subdomain-1',
    customDomain: 'custom-domain-1.com',
    // Default subdomain for Preview deployments and for local development
    defaultForPreview: true,
  },
  {
    name: 'Site 2',
    description: 'Subdomain only',
    subdomain: 'subdomain-2',
  },
  {
    name: 'Site 3',
    description: 'Subdomain only',
    subdomain: 'subdomain-3',
  },
]
const DEFAULT_HOST = hostnamesDB.find((h) => h.defaultForPreview)

/**
 * Returns the data of the hostname based on its subdomain or custom domain
 * or the default host if there's no match.
 *
 * This method is used by middleware.ts
 */
export async function getHostnameDataOrDefault(
  subdomainOrCustomDomain?: string
) {
  if (!subdomainOrCustomDomain) return DEFAULT_HOST

  // check if site is a custom domain or a subdomain
  const customDomain = subdomainOrCustomDomain.includes('.')

  // fetch data from mock database using the site value as the key
  return (
    hostnamesDB.find((item) =>
      customDomain
        ? item.customDomain === subdomainOrCustomDomain
        : item.subdomain === subdomainOrCustomDomain
    ) ?? DEFAULT_HOST
  )
}

/**
 * Returns the data of the hostname based on its subdomain.
 *
 * This method is used by pages under middleware.ts
 */
export async function getHostnameDataBySubdomain(subdomain: string) {
  return hostnamesDB.find((item) => item.subdomain === subdomain)
}

/**
 * Returns the paths for `getStaticPaths` based on the subdomain of every
 * available hostname.
 */
export async function getSubdomainPaths() {
  // get all sites that have subdomains set up
  const subdomains = hostnamesDB.filter((item) => item.subdomain)

  // build paths for each of the sites in the previous two lists
  return subdomains.map((item) => {
    return { params: { site: item.subdomain } }
  })
}

export default hostnamesDB

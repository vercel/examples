export type Product = {
  name: string
  price: string
  tagline: string
  badge?: string
}

export type Collection = {
  slug: string
  title: string
  description: string
  status: 'Live' | 'Pre-launch' | 'Limited' | 'Archived'
  accent: string
  incomingPaths: string[]
  highlights: string[]
  products: Product[]
}

export const collections: Collection[] = [
  {
    slug: 'fall-2025',
    title: 'Fall 2025',
    description:
      'Merino layers, structured carry, and weather-treated outerwear for a Northern-hemisphere launch.',
    status: 'Live',
    accent: 'from-amber-50 via-orange-50 to-amber-100',
    incomingPaths: ['/catalog/fall', '/catalog/fall-2024'],
    highlights: [
      'Redirects keep the retired /catalog/fall path pointed at the new season',
      'Merchandising tweaks publish in Contentful without shipping code',
      'Great for evergreen articles that always point to “fall”',
    ],
    products: [
      { name: 'Transit Shell', price: '$198', tagline: 'Recycled, rain ready shell with heat mapping', badge: 'Featured' },
      { name: 'Layered Merino', price: '$128', tagline: 'Temperature-regulating knit built for travel days' },
      { name: 'Compression Pack', price: '$88', tagline: 'Carry-on sized with modular pouches' },
    ],
  },
  {
    slug: 'winter-2025',
    title: 'Winter 2025',
    description:
      'Thermal capsules and insulated accessories for cold-weather drops. Redirected from last year’s “winter” vanity URL.',
    status: 'Live',
    accent: 'from-slate-50 via-blue-50 to-indigo-100',
    incomingPaths: ['/catalog/winter', '/catalog/winter-2024'],
    highlights: [
      'Marketing keeps /catalog/winter alive while inventory rotates',
      'Preserves inbound traffic from ads without re-cutting creatives',
      'Simple CSV export from Contentful drives the bulk redirect file',
    ],
    products: [
      { name: 'Glacier Parka', price: '$248', tagline: 'Storm-ready parka with recycled insulation', badge: 'New' },
      { name: 'Thermal Bottle', price: '$38', tagline: 'All-day heat retention with a low-profile lid' },
      { name: 'Cable Knit Beanie', price: '$34', tagline: 'Soft handfeel with traceable wool' },
    ],
  },
  {
    slug: 'spring-2026',
    title: 'Spring 2026',
    description:
      'Lightweight carry and breathable layers for the next launch wave. Great target for “/catalog/latest” redirects.',
    status: 'Pre-launch',
    accent: 'from-emerald-50 via-teal-50 to-emerald-100',
    incomingPaths: ['/catalog/latest', '/campaign/spring-preview'],
    highlights: [
      'Preview route collects RSVPs even before the PDPs are published',
      'Alias /catalog/latest always points to the newest collection',
      'Pairs well with geotargeted email deep links',
    ],
    products: [
      { name: 'AirLight Shell', price: '$168', tagline: 'Packable windbreaker that folds into its own pocket' },
      { name: 'Commuter Tote', price: '$118', tagline: 'Laptop-friendly tote with wet pocket' },
      { name: 'Everyday Sandal', price: '$78', tagline: 'Minimal silhouette with soft webbing' },
    ],
  },
  {
    slug: 'limited-edition',
    title: 'Limited Edition',
    description:
      'Short-run collabs and “small batch” drops. Redirect product aliases to this landing page when a SKU sunsets.',
    status: 'Limited',
    accent: 'from-fuchsia-50 via-rose-50 to-purple-100',
    incomingPaths: ['/products/daybreak-pack', '/products/aurora-duffel'],
    highlights: [
      'Great destination for influencer vanity URLs',
      'Surface “back in stock” signups before the PDP reactivates',
      'Redirect individual SKUs instead of the whole catalog',
    ],
    products: [
      { name: 'Daybreak Pack', price: '$168', tagline: 'Structured EDC pack with magnetic hardware', badge: 'Backorder' },
      { name: 'Aurora Duffel', price: '$198', tagline: 'Weekender with compression straps' },
      { name: 'Studio Sling', price: '$98', tagline: 'Hands-free sling with hidden laptop sleeve' },
    ],
  },
  {
    slug: 'archive',
    title: 'Archive & Outlet',
    description:
      'Keep revenue flowing from evergreen blog links by routing retired SKUs to the archive instead of 404s.',
    status: 'Archived',
    accent: 'from-amber-50 via-slate-50 to-slate-100',
    incomingPaths: ['/catalog/outlet', '/catalog/archive'],
    highlights: [
      'Preserve SEO equity for long-lived merch articles',
      'Contentful entry controls whether we use 308 or 301 per path',
      'Pair with analytics to see how often legacy URLs are hit',
    ],
    products: [
      { name: 'Sample Sale Kits', price: '$58', tagline: 'Assorted pulls from last season' },
      { name: 'Seconds Bin', price: '$24', tagline: 'Minor cosmetic blemishes, full warranty' },
      { name: 'Gift with Purchase', price: '$0', tagline: 'Add-on items surfaced via redirect' },
    ],
  },
]

export function getCollection(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug)
}

export function getCollectionParams() {
  return collections.map((collection) => ({ collection: collection.slug }))
}

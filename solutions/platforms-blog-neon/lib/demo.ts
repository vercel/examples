export const DEMO_EMAIL = 'demo@random.dev'
export const DEMO_PASSWORD = 'NeonDemo123!'
export const DEMO_NAME = 'Demo Publisher'

export const DEMO_SITES = [
  {
    name: 'Northwind Notes',
    subdomain: 'northwind',
    description:
      'A small-kitchen food journal: recipes, markets, and weeknight cooking.',
    cover:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'A steaming pot of vegetable soup on a stove',
  },
  {
    name: 'Atlas Field Notes',
    subdomain: 'atlas',
    description:
      'Travel sketches from trains, trailheads, and the long way around.',
    cover:
      'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'A passenger train moving through open countryside',
  },
  {
    name: 'Lumen Lab',
    subdomain: 'lumen',
    description:
      'Essays on type, interfaces, and building software that stays out of the way.',
    cover:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Color swatches and interface sketches on a desk',
  },
] as const

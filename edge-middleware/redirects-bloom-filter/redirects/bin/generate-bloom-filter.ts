import { ScalableBloomFilter } from 'bloom-filters'
import { Redirects } from '../types'
import { writeFileSync } from 'fs'

export function test() {}

const redirects: Redirects = {
  '/blog/should-redirect-to-google': {
    target: 'https://www.google.com',
    permanent: false,
  },
  '/blog/should-redirect-to-yahoo': {
    target: 'https://www.yahoo.com',
    permanent: false,
  },
  '/blog/should-redirect-to-vercel': {
    target: 'https://www.vercel.com',
    permanent: false,
  },
}

for (let i = 0; i < 50000; i++) {
  redirects[`/blog/should-redirect-to-${i}`] = {
    target: `https://www.google.com/?redirect=${i}`,
    permanent: false,
  }
}

const filter = new ScalableBloomFilter(Object.keys(redirects).length, 0.0001)

for (const key in redirects) {
  filter.add(key)
}

const filterJson = filter.saveAsJSON()
writeFileSync(
  './redirects/redirects-bloom-filter.json',
  JSON.stringify(filterJson)
)

writeFileSync('./redirects/redirects.json', JSON.stringify(redirects))

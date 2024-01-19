import { ScalableBloomFilter } from 'bloom-filters'
import { writeFileSync } from 'fs'
import redirects from './redirects.json'

// Initialize bloom filter
const filter = new ScalableBloomFilter(Object.keys(redirects).length, 0.0001)

// Add all paths to the bloom filter
for (const key in redirects) {
  filter.add(key)
}

// Save the bloom filter to a JSON file
const filterJson = filter.saveAsJSON()
writeFileSync(
  './redirects/redirects-bloom-filter.json',
  JSON.stringify(filterJson)
)

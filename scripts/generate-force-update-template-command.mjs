import { globby } from 'globby'

const files = await globby([
  'edge-api-routes/**/package.json',
  'edge-functions/**/package.json',
  'edge-middleware/**/package.json',
  'starter/**/package.json',
])

console.log(
  `pnpm update-templates ${files
    .map((file) => file.replace('package.json', 'README.md'))
    .join(' ')}`
)

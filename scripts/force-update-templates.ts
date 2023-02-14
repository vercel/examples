import { globby } from 'globby'
import updateChangedTemplates from './lib/update-changed-templates'

const templates = await globby([
  'edge-functions/**/package.json',
  'edge-middleware/**/package.json',
  'starter/**/package.json',
])
const changedFiles = templates.map((path) =>
  path.replace('package.json', 'README.md')
)

updateChangedTemplates(changedFiles).catch((error) => {
  console.error(error)
  process.exit(1)
})

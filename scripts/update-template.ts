import updateChangedTemplates from './lib/update-changed-templates'

const examples = process.argv.slice(2)
const changedFiles = examples.map((example) => `${example}/README.md`)

updateChangedTemplates(changedFiles).catch((error) => {
  console.error(error)
  process.exit(1)
})

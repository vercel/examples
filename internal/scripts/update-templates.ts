import updateChangedTemplates from './lib/update-changed-templates'

const changedFiles = process.argv.slice(2)

updateChangedTemplates(changedFiles).catch((error) => {
  console.error(error)
  process.exit(1)
})

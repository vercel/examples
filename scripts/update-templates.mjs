import path from 'path'
import fs from 'fs/promises'
import log from './lib/log.mjs'
import updateTemplate from './lib/contentful/update-template.mjs'

const DIRS = ['edge-functions', 'solutions']
const IS_README = /readme\.md$/i
const changedFiles = process.argv.slice(2)

async function updateTemplates() {
  if (!changedFiles.length) {
    log('No changed files.')
    return
  }

  const examplePaths = changedFiles.reduce((acc, fileName) => {
    if (
      // Check for changes in directories with examples
      DIRS.some((dir) => fileName.startsWith(`${dir}/`)) &&
      // Check for updates in the readme
      IS_README.test(fileName)
    ) {
      const dirname = path.dirname(fileName)

      // Check for readme updates that happened in example's root
      if (dirname.split(path.sep).length === 2) {
        acc.push(dirname)
      }
    }
    return acc
  }, [])

  if (!examplePaths.length) {
    log('No changed readme.md files.')
    return
  }

  await Promise.all(
    examplePaths.map((examplePath) =>
      updateTemplate({ lang: 'en-US', examplePath })
    )
  )
}

updateTemplates().catch((err) => {
  console.error(err)
  process.exit(1)
})

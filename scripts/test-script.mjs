import path from 'path'
import fs from 'fs/promises'
import log from './lib/log.mjs'

const DIRS = ['edge-functions', 'solutions']

console.log('DIFF', process.argv[2])

async function updateAllTemplates() {
  const promises = DIRS.map(async (dirPath) => {
    log(`Updating all templates in ${dirPath}...`)

    const files = await fs.readdir(dirPath)

    await Promise.all(
      files.map(async (fileName) => {
        const examplePath = path.join(dirPath, fileName)
        const isDir = (await fs.lstat(examplePath)).isDirectory()

        if (!isDir) return

        log(examplePath)
      })
    )
  })

  return Promise.all(promises)
}

updateAllTemplates().catch((err) => {
  console.error(err)
  process.exit(1)
})

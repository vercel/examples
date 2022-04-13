import path from 'path'
import fs from 'fs/promises'
import log from './lib/log.mjs'

const DIRS = ['edge-functions', 'solutions']
const changedFiles = process.argv.slice(2)

async function updateAllTemplates() {
  // const promises = DIRS.map(async (dirPath) => {
  //   log(`Updating all templates in ${dirPath}...`)

  //   const files = await fs.readdir(dirPath)

  //   await Promise.all(
  //     files.map(async (fileName) => {
  //       const examplePath = path.join(dirPath, fileName)
  //       const isDir = (await fs.lstat(examplePath)).isDirectory()

  //       if (!isDir) return

  //       if (changedFiles.includes) {

  //       log(examplePath)
  //     })
  //   )
  // })

  await Promise.all(
    changedFiles.map(async (fileName) => {
      if (
        !DIRS.some((dir) => fileName.startsWith(`${dir}/`)) ||
        !fileName.test(/readme\.md$/i)
      ) {
        return
      }

      // const examplePath = path.dirname(dirPath)
      // const isDir = (await fs.lstat(examplePath)).isDirectory()

      // if (!isDir) return

      log(fileName)
    })
  )

  // return Promise.all(promises)
}

updateAllTemplates().catch((err) => {
  console.error(err)
  process.exit(1)
})

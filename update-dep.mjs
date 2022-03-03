import path from 'path'
import fs from 'fs/promises'
import { constants } from 'fs'
import { promisify } from 'util'
import child from 'child_process'

const exec = promisify(child.exec)
const log = (...args) => {
  if (process.env.DEBUG !== '0') {
    console.log(...args)
  }
}
const DIRS = ['edge-functions', 'solutions', 'packages']
const packageName = process.argv[2]
const hasPackageName = (name) => {
  const str = packageName.replace(new RegExp(`^${name}`), '')
  return (
    str.length !== packageName.length && (str.length ? str[0] === '@' : true)
  )
}

log('Package name:', packageName)

async function updateDependency() {
  if (!packageName?.length) {
    throw new Error('No dependency to install specified')
  }

  const promises = DIRS.map(async (dirPath) => {
    log(`Updating all packages in ${dirPath}...`)

    const files = await fs.readdir(dirPath)

    await Promise.all(
      files.map(async (fileName) => {
        const filePath = path.join(dirPath, fileName)
        const isDir = (await fs.lstat(filePath)).isDirectory()

        if (!isDir) return

        const packageJson = await fs
          .readFile(`./${filePath}/package.json`, 'utf8')
          .then((str) => JSON.parse(str))
          .catch((err) => {
            if (err.code !== 'ENOENT') throw err
          })

        if (!packageJson) return

        if (
          !Object.keys(packageJson.dependencies || {}).some(hasPackageName) &&
          !Object.keys(packageJson.devDependencies || {}).some(hasPackageName)
        ) {
          return
        }

        const hasPackageLock = await fs
          .access(`./${filePath}/package-lock.json`, constants.F_OK)
          .catch((err) => (err ? false : true))
        const hasYarnLock = await fs
          .access(`./${filePath}/yarn.lock`, constants.F_OK)
          .catch((err) => (err ? false : true))

        return hasPackageLock !== false || !hasYarnLock
          ? exec(`npm install ${packageName}`, { cwd: filePath })
          : exec(`yarn add ${packageName}`, { cwd: filePath })
      })
    )

    log(`Finished updating all packages in ${dirPath}`)
  })

  await Promise.all(promises)
}

updateDependency().catch((err) => {
  console.error(err)
  process.exit(1)
})

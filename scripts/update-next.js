/**
 *  Updates the version of Next.js and runtime in the examples.
 */
const fs = require('fs').promises
const path = require('path')
const https = require('https')
const prettier = require('prettier')
const childProcess = require('child_process')

const LATEST_API = 'next-middleware-build.vercel.sh/latest.json'
const NEXT_LATEST = 'https://next-middleware-build.vercel.sh/latest'

console.log(
  `It's recommended to be on npm 7 if you're not already for package-lock to be updated properly.`
)
console.log()

function getLatest() {
  return new Promise((resolve, reject) => {
    https
      .get(`https://${LATEST_API}`, (res) => {
        let data = ''

        if (res.statusCode !== 200) {
          reject(
            new Error(
              `[${LATEST_API}] Unexpected status code: ${res.statusCode}`
            )
          )
          return
        }

        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
          resolve(JSON.parse(data))
        })
      })
      .on('error', reject)
  })
}

function updatePackageLock(cwd) {
  return new Promise((resolve, reject) => {
    childProcess.exec('npm install --package-lock-only', { cwd }, (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}

async function updateNext() {
  const rootDir = path.join(__dirname, '..')
  const examplesPath = path.join(rootDir, 'examples')
  const files = await fs.readdir(examplesPath)
  const latest = await getLatest()
  const promises = files.map(async (file) => {
    const filePath = path.join(examplesPath, file)
    const stat = await fs.stat(filePath)

    if (!stat.isDirectory()) return

    const packageJsonPath = path.join(filePath, 'package.json')
    const packageJson = await fs
      .readFile(packageJsonPath, 'utf8')
      .then((str) => JSON.parse(str))
      .catch((err) => null)
    const next = packageJson?.dependencies?.next

    if (!next) return
    // This one checks for a fixed version
    // if (next !== latest.next) {
    if (next !== NEXT_LATEST) {
      console.log(
        `Updating Next.js version in ${filePath.replace(rootDir, '')}`
      )
      packageJson.dependencies.next = NEXT_LATEST

      const content = prettier.format(JSON.stringify(packageJson, null, 2), {
        parser: 'json',
      })

      // Update package.json
      await fs.writeFile(packageJsonPath, content)
      // Update package-lock.json
      await updatePackageLock(filePath)
    } else {
      console.log(`Updating package-lock in ${filePath.replace(rootDir, '')}`)
      await updatePackageLock(filePath)
    }

    const vercelJsonPath = path.join(filePath, 'vercel.json')
    const vercelJson = await fs
      .readFile(vercelJsonPath, 'utf8')
      .then((str) => JSON.parse(str))
      .catch((err) => null)
    const nextBuild = vercelJson?.builds?.find((build) =>
      build.use.includes('@vercelruntimes/next')
    )

    if (!nextBuild) return
    if (nextBuild.use !== latest.runtime) {
      console.log(`Updating runtime in ${filePath.replace(rootDir, '')}`)
      nextBuild.use = latest.runtime

      const content = prettier.format(JSON.stringify(vercelJson, null, 2), {
        parser: 'json',
      })

      await fs.writeFile(vercelJsonPath, content)
    }
  })

  await Promise.all(promises)

  console.log()
  console.log('Done!')
}

updateNext().catch((err) => {
  console.error(err)
  process.exit(1)
})

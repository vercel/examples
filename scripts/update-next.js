/**
 *  Updates the version of Next.js and runtime in the examples.
 */
const fs = require('fs').promises
const path = require('path')
const childProcess = require('child_process')

console.log(
  `It's recommended to be on npm 7 if you're not already for package-lock to be updated properly.`
)
console.log()

const NEXT_VERSION = 'canary'

function execCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, { cwd }, (error) => {
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
  const examplesPath = path.join(rootDir, 'edge-functions')
  const files = await fs.readdir(examplesPath)
  const promises = files.map(async (file) => {
    const filePath = path.join(examplesPath, file)
    const stat = await fs.stat(filePath)

    if (!stat.isDirectory()) return

    const packageJsonPath = path.join(filePath, 'package.json')
    const packageJson = await fs
      .readFile(packageJsonPath, 'utf8')
      .then((str) => JSON.parse(str))
      .catch((err) => null)
    // const next = packageJson?.dependencies?.next
    const next = packageJson?.dependencies?.['@vercel/edge-functions-ui']

    if (!next) return

    console.log(`Updating Next.js version in ${filePath.replace(rootDir, '')}`)
    // Update package-lock.json
    // await execCommand(`npm i next@${NEXT_VERSION}`, filePath)
    await execCommand(`npm i @vercel/edge-functions-ui`, filePath)

    // const vercelJsonPath = path.join(filePath, 'vercel.json')
    // const vercelJson = await fs
    //   .readFile(vercelJsonPath, 'utf8')
    //   .then((str) => JSON.parse(str))
    //   .catch((err) => null)
    // const nextBuild = vercelJson?.builds?.find((build) =>
    //   build.use.includes('@vercelruntimes/next')
    // )

    // if (!nextBuild) return
    // await fs.unlink(vercelJsonPath)
  })

  await Promise.all(promises)

  console.log()
  console.log('Done!')
}

updateNext().catch((err) => {
  console.error(err)
  process.exit(1)
})

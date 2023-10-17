import fs from 'node:fs/promises'
import frontMatter from 'front-matter'
import path from 'node:path'
import getTest from './lib/get-test'

type Attributes = {
  demoUrl?: string
  ignoreE2E?: boolean
}

async function generateTests() {
  // Go from `internal/packages/playwright/dist/scripts` to `internal/packages/playwright`
  const packageRoot = path.resolve(__dirname, '../..')
  // Go from `internal/packages/playwright` to the root of the repo
  const rootDir = path.join(packageRoot, '../../..')
  // This is where all the tests will be generated
  const relativeTestDir = path.join('src', 'e2e', 'tests', 'generated')
  const testDir = path.join(packageRoot, relativeTestDir)
  const getFiles = (folder: string): Promise<[string, string[]]> =>
    fs.readdir(path.join(rootDir, folder)).then((paths) => [folder, paths])
  const examplesBySection = await Promise.all([
    getFiles('edge-functions'),
    getFiles('edge-middleware'),
    getFiles('solutions'),
    getFiles('starter'),
  ])
  let count = 0

  // Ensure that the test directory exists
  await fs.mkdir(testDir, { recursive: true })
  // Write all tests to the test directory
  await Promise.all(
    examplesBySection.map(([folder, paths]) =>
      Promise.all(
        paths.map(async (exampleName) => {
          const examplePath = path.join(rootDir, folder, exampleName)
          const stat = await fs.stat(examplePath)

          if (!stat.isDirectory()) return

          const exampleFiles = await fs.readdir(examplePath)
          const readme = exampleFiles.find((file) => /readme\.md$/i.test(file))

          if (!readme) return

          const content = await fs.readFile(
            path.join(examplePath, readme),
            'utf8'
          )
          const { attributes } = frontMatter<Attributes>(content)

          if (!attributes.demoUrl || attributes.ignoreE2E) return

          const testContent = getTest(attributes.demoUrl)

          await fs.writeFile(
            path.join(testDir, `${exampleName}.spec.ts`),
            testContent
          )
          count++
        })
      )
    )
  ).finally(() => {
    console.log(`\n Added ${count} tests to ${relativeTestDir}\n`)
  })
}

generateTests().catch((error) => {
  console.error(error)
  process.exit(1)
})

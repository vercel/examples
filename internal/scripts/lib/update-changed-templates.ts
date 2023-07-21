import path from 'path'
import log from './log'
import updateTemplate from './contentful/update-template'

const DIRS = [
  'edge-functions',
  'edge-middleware',
  'solutions',
  'starter',
  'storage',
]
const IS_README = /readme\.md$/i

export default async function updateChangedTemplates(changedFiles: string[]) {
  changedFiles = changedFiles.flatMap((fileName) => fileName.split(' '))

  if (!changedFiles.length) {
    log('No changed files.')
    return
  }

  const examplePaths = changedFiles.reduce<string[]>((acc, fileName) => {
    if (fileName.startsWith('./')) {
      throw new Error(
        'Only paths relative to the root are supported. If you see this error please report it as an issue.'
      )
    }

    if (
      // Check for changes in directories with examples
      DIRS.some((dir) => fileName.startsWith(`${dir}/`)) &&
      // Check for updates in the readme
      IS_README.test(fileName)
    ) {
      // solutions/monorepo/README.md -> solutions/monorepo
      const dirname = path.dirname(fileName)

      // Check for readme updates that happened in example's root. We only allow one level of nesting.
      // [solutions, monorepo] -> length: 2
      if (dirname.split(path.sep).length === 2) {
        acc.push(dirname)
      }
    }
    return acc
  }, [])

  if (!examplePaths.length) {
    log('No changed README.md files.')
    return
  }

  await Promise.all(
    examplePaths.map((examplePath) => updateTemplate({ examplePath }))
  )
}

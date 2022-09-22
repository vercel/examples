import fs from 'fs/promises'

export default async function getReadme(path: string) {
  const files = await fs.readdir(path)

  if (!files.includes('package.json')) {
    throw new Error('No package.json found in example directory')
  }

  return fs
    .readFile(`./${path}/README.md`, 'utf8')
    .then((str) => str)
    .catch((err) => {
      if (err.code !== 'ENOENT') throw err
    })
}

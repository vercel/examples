import fs from 'fs/promises'

export default async function getReadme(path: string) {
  return fs
    .readFile(`./${path}/README.md`, 'utf8')
    .then((str) => str)
    .catch((err) => {
      if (err.code !== 'ENOENT') throw err
    })
}

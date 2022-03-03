import fetch from 'node-fetch'
import path from 'path'
import fs from 'fs/promises'
import { promisify } from 'util'
import child from 'child_process'

const exec = promisify(child.exec)
const sha = process.argv[2]

async function createProject() {
  if (!sha) {
    throw new Error('Missing SHA')
  }

  console.log('SHA', sha)
  const { stdout: diff } = await exec(
    `git diff --exit-code --name-status ${sha} origin/main`
  ).catch((err) => {
    if (err.code === 1) {
      return err
    }
    throw err
  })
  console.log('DIFF', diff)

  if (!diff.length) return

  const files = diff.split('\n').filter((line) => {
    if (!line.length) return

    const [status, filePath, toPath] = line.split('\t')
    const fileName = path.basename(filePath)

    if (fileName === 'package.json') {
      if (status[0] === 'A') {
        const data = {
          // name: '',
        }
        // TODO: create the Vercel project
        console.log(
          'https://vercel.com/api/v5/projects/edge-functions-ab-testing-simple?teamId=team_nLlpyC6REAqxydlFKbrMDlud',
          {
            method: 'POST',
            headers: {
              accept: '*/*',
              'accept-language': 'en-US,en;q=0.9',
              authorization: 'bearer AChkszudacsio72hEPu4CAfF',
              'cache-control': 'no-cache',
              'content-type': 'application/json; charset=utf-8',
              pragma: 'no-cache',
              'sec-fetch-dest': 'empty',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'same-origin',
              'sec-gpc': '1',
              Referer:
                'https://vercel.com/vercel/edge-functions-ab-testing-simple/settings/git',
              'Referrer-Policy': 'origin-when-cross-origin',
            },
            body: '{"commandForIgnoringBuildStep":"git diff --quiet HEAD^ HEAD -- :/edge-functions/ab-testing-simple"}',
          }
        )
      }
      // if (status[0] === 'D') {
      //   // Note: we could delete the Vercel project here, but that's probably a
      //   // task we can do manually, in case we don't want to delete the project yet
      // }
      if (status[0] === 'R') {
        // TODO: We could change the ignoring build step config here
        // fetch(
        //   'https://vercel.com/api/v5/projects/edge-functions-ab-testing-simple?teamId=team_nLlpyC6REAqxydlFKbrMDlud',
        //   {
        //     method: 'PATCH',
        //     headers: {
        //       accept: '*/*',
        //       'accept-language': 'en-US,en;q=0.9',
        //       authorization: 'bearer AChkszudacsio72hEPu4CAfF',
        //       'cache-control': 'no-cache',
        //       'content-type': 'application/json; charset=utf-8',
        //       pragma: 'no-cache',
        //       'sec-fetch-dest': 'empty',
        //       'sec-fetch-mode': 'cors',
        //       'sec-fetch-site': 'same-origin',
        //       'sec-gpc': '1',
        //       Referer:
        //         'https://vercel.com/vercel/edge-functions-ab-testing-simple/settings/git',
        //       'Referrer-Policy': 'origin-when-cross-origin',
        //     },
        //     body: '{"commandForIgnoringBuildStep":"git diff --quiet HEAD^ HEAD -- :/edge-functions/ab-testing-simple"}',
        //   }
        // )
      }
    }
    console.log(status, filePath, toPath)
  })

  // console.log('OUTPUT', diff.split('\n'))
}

createProject().catch((err) => {
  console.error(err)
  process.exit(1)
})

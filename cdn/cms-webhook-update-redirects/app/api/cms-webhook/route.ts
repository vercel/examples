import { NextResponse } from 'next/server'
import { Vercel } from '@vercel/sdk'

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_BEARER_TOKEN,
})

/**
 * This route handler mimics a webhook from a CMS that takes the payload
 * and updates the redirects that are served for the Vercel project.
 *
 * When a webhook is received, the route handler can parse the data from
 * the request body and update the redirects. New redirects will initially
 * be staged, and the code can then decide to promote the new version
 * to production so it will serve end users.
 */
export async function POST() {
  const teamId = process.env.VERCEL_TEAM_ID as string
  const projectId = process.env.VERCEL_PROJECT_ID as string
  if (!teamId || !projectId) {
    return NextResponse.json(
      { error: 'Missing environment variables' },
      { status: 500 }
    )
  }

  const randomSuffix = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  const result = await vercel.bulkRedirects.stageRedirects({
    teamId,
    requestBody: {
      teamId,
      projectId,
      redirects: [
        {
          source: '/catalog/fall',
          destination: `/catalog/fall-${randomSuffix}`,
          statusCode: 307,
        },
      ],
    },
  })

  const newVersion = result.version
  if (!newVersion) {
    return NextResponse.json(
      { error: 'Failed to create new version' },
      { status: 500 }
    )
  }

  const publishResult = await vercel.bulkRedirects.updateVersion({
    teamId,
    projectId,
    requestBody: {
      action: 'promote',
      id: newVersion.id,
    },
  })
  if (!publishResult || !publishResult.version) {
    return NextResponse.json(
      { error: 'Failed to publish new version' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    message: 'Success!',
    version: publishResult.version,
  })
}

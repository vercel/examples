import { Sandbox } from '@vercel/sandbox'
import { Vercel } from '@vercel/sdk'
import { NextResponse } from 'next/server'
import z from 'zod/v4'

const deployRequestSchema = z.object({
  paths: z.array(z.string().min(1)),
  sandboxId: z.string().min(1),
  projectId: z.string().nullable().optional(),
})

const vercelJsonSchema = z.object({
  framework: z.string().min(1),
})

const deploymentIdSchema = z.string().min(1)

// VERCEL_TOKEN is the token for the team you want agent generated code to be deployed to

export async function POST(request: Request) {
  const body = await request.json()
  const { paths, sandboxId, projectId } = deployRequestSchema.parse(body)

  const sandbox = await Sandbox.get({ sandboxId })
  const readFile = async (path: string) => {
    const stream = await sandbox.readFile({ path })
    const response = new Response(stream as unknown as ReadableStream)
    const text = await response.text()
    return {
      file: path,
      data: text,
    }
  }

  const files = await Promise.all(paths.map(readFile))

  const vercel = new Vercel({
    bearerToken: process.env.VERCEL_TOKEN,
  })

  const random4Chars = Math.random().toString(36).substring(2, 6)

  const vercelJson = files.find((file) => file.file === 'vercel.json')
  let projectSettings: Record<string, unknown> = {}
  if (vercelJson) {
    const vercelJsonData = vercelJsonSchema.parse(JSON.parse(vercelJson.data))
    projectSettings = {
      framework: vercelJsonData.framework,
    }
  }

  const deployment = await vercel.deployments.createDeployment({
    requestBody: {
      name: `oss-vibe-coding-platform-deploy-${random4Chars}`,
      files,
      target: 'production',
      projectSettings,
      project: projectId ?? undefined,
    },
  })

  // We don't want protection on deployments as they're public
  // Run this logic only once based on if projectId is null
  if (!projectId) {
    await vercel.projects.updateProject({
      requestBody: { ssoProtection: null },
      idOrName: deployment.projectId,
    })
  }

  return NextResponse.json({
    url: deployment.url,
    id: deployment.id,
    projectId: deployment.projectId,
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idParam = searchParams.get('id')
  if (!idParam) {
    return NextResponse.json(
      { error: 'Missing deployment id' },
      { status: 400 }
    )
  }

  const deploymentId = deploymentIdSchema.parse(idParam)

  const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN })

  const deployment = await vercel.deployments.getDeployment({
    idOrUrl: deploymentId,
  })

  return NextResponse.json({
    readyState: deployment.readyState,
    url: deployment.url,
    id: deployment.id,
  })
}

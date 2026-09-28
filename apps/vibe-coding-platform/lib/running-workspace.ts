import { APIError, Sandbox } from '@vercel/sandbox'
import { restartPreview } from './workspace'

export async function getRunningWorkspace(name: string) {
  try {
    const sandbox = await Sandbox.get({
      name,
      resume: false,
      onResume: restartPreview,
    })
    // SDK I/O auto-resumes even after get({ resume: false }); check before I/O.
    return sandbox.status === 'running' ? sandbox : null
  } catch (error) {
    if (error instanceof APIError && error.response.status === 404) return null
    throw error
  }
}

export function workspaceStopped() {
  return Response.json(
    { status: 'stopped', error: 'Workspace is paused' },
    {
      status: 409,
      headers: { 'cache-control': 'no-store' },
    }
  )
}

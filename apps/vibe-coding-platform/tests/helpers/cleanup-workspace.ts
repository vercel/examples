import { APIError, Drive, Sandbox } from '@vercel/sandbox'
import { workspaceName } from '../../lib/project-auth'

type TestSandbox = Pick<Sandbox, 'stop' | 'delete'>
type Lookups = {
  sandbox(name: string): Promise<TestSandbox | null>
  drive(name: string): Promise<Pick<Drive, 'delete'>>
}

const lookups: Lookups = {
  async sandbox(name) {
    try {
      return await Sandbox.get({ name, resume: false })
    } catch (error) {
      if (error instanceof APIError && error.response.status === 404)
        return null
      throw error
    }
  },
  drive: (name) =>
    Drive.getOrCreate({ name, region: process.env.SANDBOX_REGION ?? 'iad1' }),
}

export async function cleanupWorkspace(
  sessionId: string,
  sandbox?: TestSandbox,
  resources = lookups
) {
  const name = workspaceName(sessionId)
  const failures: unknown[] = []
  async function attempt<T>(label: string, action: () => Promise<T>) {
    try {
      return await action()
    } catch (error) {
      failures.push(new Error(`${label}: ${name}`, { cause: error }))
    }
  }
  const current =
    sandbox ?? (await attempt('Look up sandbox', () => resources.sandbox(name)))
  if (current) {
    await attempt('Stop sandbox', () => current.stop())
    await attempt('Delete sandbox', () => current.delete())
  }
  const drive = await attempt('Look up drive', () => resources.drive(name))
  if (drive) await attempt('Delete drive', () => drive.delete())
  if (failures.length)
    throw new AggregateError(failures, `Cleanup failed for ${name}`)
}

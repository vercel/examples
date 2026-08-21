type Consumer = 'nextjs' | 'python'

export type TaskRecord = {
  taskId: string
  expectedConsumers: Consumer[]
  messageId: string | null
}

function backendUrl(path: string) {
  if (!process.env.BACKEND_URL) {
    throw new Error('BACKEND_URL service binding is not configured')
  }
  return new URL(path, process.env.BACKEND_URL).toString()
}

async function assertSuccessful(response: Response) {
  if (response.ok) return

  const detail = await response.text()
  throw new Error(`Result store request failed (${response.status}): ${detail}`)
}

export async function putTask(task: TaskRecord) {
  const response = await fetch(backendUrl(`/api/python/tasks/${task.taskId}`), {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(task),
  })
  await assertSuccessful(response)
}

export async function deleteTask(taskId: string) {
  const response = await fetch(backendUrl(`/api/python/tasks/${taskId}`), {
    method: 'DELETE',
  })
  await assertSuccessful(response)
}

export async function completeTask(
  taskId: string,
  consumer: Consumer,
  result: Record<string, unknown>
) {
  const response = await fetch(
    backendUrl(`/api/python/tasks/${taskId}/completions/${consumer}`),
    {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        result,
      }),
    }
  )
  await assertSuccessful(response)
}

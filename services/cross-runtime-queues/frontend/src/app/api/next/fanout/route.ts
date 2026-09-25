import { send } from '@vercel/queue'
import { deleteTask, putTask, type TaskRecord } from '@/lib/task-store'

export async function POST(request: Request) {
  const payload = await request.json()
  const taskId = crypto.randomUUID()
  const task: TaskRecord = {
    taskId,
    expectedConsumers: ['nextjs', 'python'],
    messageId: null,
  }

  await putTask(task)
  try {
    const { messageId } = await send('demo-fanout', {
      ...payload,
      taskId,
    })
    task.messageId = messageId
    await putTask(task)

    return Response.json(task)
  } catch (error) {
    await deleteTask(taskId)
    throw error
  }
}

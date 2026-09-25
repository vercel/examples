import { handleCallback } from '@vercel/queue'
import { completeTask } from '@/lib/task-store'

type DemoMessage = {
  taskId: string
  text: string
  sentAt: string
}

export const POST = handleCallback<DemoMessage>(async (message, metadata) => {
  await completeTask(message.taskId, 'nextjs', {
    messageId: metadata.messageId,
    deliveryCount: metadata.deliveryCount,
    received: message,
  })
  console.log('[nextjs fanout consumer] received a copy', {
    message,
    messageId: metadata.messageId,
    consumerGroup: metadata.consumerGroup,
    deliveryCount: metadata.deliveryCount,
  })
})

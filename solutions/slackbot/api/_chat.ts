import { WebClient } from '@slack/web-api'
import { getGPTResponse, generatePromptFromThread } from './_openai'

const slack = new WebClient(process.env.SLACK_BOT_TOKEN)

type Event = {
  channel: string
  ts: string
  thread_ts?: string
}

export async function sendGPTResponse(event: Event) {
  const { channel, ts, thread_ts } = event

  try {
    const thread = await slack.conversations.replies({
      channel,
      ts: thread_ts ?? ts,
      inclusive: true,
    })

    const prompts = await generatePromptFromThread(thread)
    const gptResponse = await getGPTResponse(prompts)

    await slack.chat.postMessage({
      channel,
      thread_ts: ts,
      text: `${gptResponse.choices[0].message.content}`,
    })
  } catch (error) {
    if (error instanceof Error) {
      await slack.chat.postMessage({
        channel,
        thread_ts: ts,
        text: `<@${process.env.SLACK_ADMIN_MEMBER_ID}> Error: ${error.message}`,
      })
    }
  }
}

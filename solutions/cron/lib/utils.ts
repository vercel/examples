import { Redis } from '@upstash/redis'
import createSendmail from 'sendmail'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

const sendmail = createSendmail({})
export const send = (email: string, message: string) => {
  return sendmail(
    {
      from: 'stey@vercel.com',
      to: email,
      subject: '🚀 Your Daily Dose of Top Hacker News Posts',
      html: message,
    },
    function (err, reply) {
      console.log('ERROR', err && err.stack)
      console.dir('REPLY', reply)
    }
  )
}

export const getTopStories = async () => {
  const topStories = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then((res) => res.json())
  const topStoriesData = await Promise.all(
    topStories.slice(0, 10).map(async (id: string) => {
      const story = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => res.json())
      return story
    })
  )
  return topStoriesData
}

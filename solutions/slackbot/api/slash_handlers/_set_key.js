import { redis } from '../_constants'

export async function setKey(res, commandArray) {
  let key = commandArray[1]
  let value = commandArray[2]

  try {
    const data = await redis.set(key, value)

    console.log('data from fetch:', data)
    res.send({
      response_type: 'in_channel',
      text: `Successfully set ${key}=${value}`,
    })
  } catch (err) {
    console.log('fetch Error:', err)
    res.send({
      response_type: 'ephemeral',
      text: `${err}`,
    })
  }
}

import fetch from 'node-fetch'
import { redis } from '../_constants'

export async function getKey(res, commandArray) {
  let key = commandArray[1]

  try {
    const data = await redis.get(key)
    console.log('data from fetch:', data)

    res.send({
      response_type: 'in_channel',
      text: `Value for "${key}": "${data}"`,
    })
  } catch (err) {
    console.log('fetch Error:', err)
    res.send({
      response_type: 'ephemeral',
      text: `${err}`,
    })
  }
}

import fetch from 'node-fetch'
import { redisURL, redisToken } from '../_constants'

export async function getKey(res, commandArray) {
  let key = commandArray[1]

  try {
    const url = `${redisURL}/get/${key}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${redisToken}`,
      },
    })
    const data = await response.json()

    console.log('data from fetch:', data)
    res.send({
      response_type: 'in_channel',
      text: `Value for "${key}": "${data.result}"`,
    })
  } catch (err) {
    console.log('fetch Error:', err.response.data.error)
    res.send({
      response_type: 'ephemeral',
      text: `${err.response.data.error}`,
    })
  }
}

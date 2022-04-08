import fetch from 'node-fetch'
import { redisURL, redisToken } from '../_constants'

export async function setKey(res, commandArray) {
  let key = commandArray[1]
  let value = commandArray[2]

  try {
    const url = `${redisURL}/set/${key}/${value}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${redisToken}`,
      },
    })
    const data = await response.json()

    console.log('data from fetch:', data)
    res.send({
      response_type: 'in_channel',
      text: `Successfully set ${key}=${value}`,
    })
  } catch (err) {
    console.log('fetch Error:', err)
    res.send({
      response_type: 'ephemeral',
      text: `${err.response.data.error}`,
    })
  }
}

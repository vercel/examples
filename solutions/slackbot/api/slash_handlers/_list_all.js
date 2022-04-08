import fetch from 'node-fetch'
import { redisURL, redisToken } from '../_constants'

export async function listAll(res, commandArray) {
  let listName = commandArray[1]

  try {
    const url = `${redisURL}/LRANGE/${listName}/0/${2 ** 32 - 1}`

    const response = await fetch(url, {
      // Max size for redis list is defined as 2**32-1
      headers: {
        Authorization: `Bearer ${redisToken}`,
      },
    })
    const data = await response.json()

    console.log('data from fetch:', data)

    let text = ''
    data.result.forEach((element, index) => {
      text += index + 1 + '. ' + element + '\n'
    })

    res.send({
      response_type: 'in_channel',
      text: `"${listName}" contains: \n ${text}`,
    })
  } catch (err) {
    console.log('fetch Error:', err)
    res.send({
      response_type: 'ephemeral',
      text: `${err.response.data.error}`,
    })
  }
}

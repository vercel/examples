import fetch from 'node-fetch'

import { redisURL, redisToken } from '../_constants'

export async function removeFromList(res, commandArray) {
  let listName = commandArray[1]

  let value = ''

  for (let i = 2; i < commandArray.length; i++) {
    value += commandArray[i] + ' '
  }

  try {
    const url = `${redisURL}/LREM/${listName}/0/${value}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${redisToken}`,
      },
    })
    const data = await response.json()

    console.log('data from fetch:', data)
    res.send({
      response_type: 'in_channel',
      text: `Successfully removed "${value}" entry from list: "${listName}".`,
    })
  } catch (err) {
    console.log('fetch Error:', err)
    res.send({
      response_type: 'ephemeral',
      text: `${err.response.data.error}`,
    })
  }
}

import axios from 'axios'
import { redisURL, redisToken } from '../_constants'

export async function setKey(res, commandArray) {
  let key = commandArray[1]
  let value = commandArray[2]

  try {
    const response = await axios({
      url: `${redisURL}/set/${key}/${value}`,
      headers: {
        Authorization: `Bearer ${redisToken}`,
      },
    })
    console.log('data from axios:', response.data)
    res.send({
      response_type: 'in_channel',
      text: `Successfully set ${key}=${value}`,
    })
  } catch (err) {
    console.log('axios Error:', err)
    res.send({
      response_type: 'ephemeral',
      text: `${err.response.data.error}`,
    })
  }
}

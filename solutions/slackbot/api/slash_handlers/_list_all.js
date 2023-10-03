import { redis } from '../_constants'

export async function listAll(res, commandArray) {
  let listName = commandArray[1]

  try {
    const data = await redis.lrange(listName, 0, 2 ** 32 - 1)
    console.log('data from fetch:', data)

    let text = ''
    data.forEach((element, index) => {
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
      text: `${err}`,
    })
  }
}

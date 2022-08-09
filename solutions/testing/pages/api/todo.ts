import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../lib/db'

/**
 * @docs https://nextjs.org/docs/api-routes/introduction
 */
export default async function todos(req: NextApiRequest, res: NextApiResponse) {
  const user = await db.getUserFromReq(req)

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const { username } = user

  try {
    switch (req.method) {
      case 'GET': {
        const todos = await db.getTodos(username, req)

        return res.status(200).json({ todos })
      }
      case 'POST': {
        const title = req.body.title?.trim()

        if (!title) {
          return res.status(400).json({ error: { message: 'Invalid request' } })
        }

        const todos = await db.addTodo(username, { title }, req, res)

        return res.status(200).json({ todos })
      }
      case 'PATCH': {
        const { id } = req.query

        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: { message: 'Invalid request' } })
        }

        const todos = await db.updateTodo(username, id, req.body, req, res)

        return res.status(200).json({ todos })
      }
      case 'DELETE': {
        const { id } = req.query

        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: { message: 'Invalid request' } })
        }

        const todos = await db.removeTodo(username, id, req, res)

        return res.status(200).json({ todos })
      }
      default:
        res.status(405).json({
          error: { message: 'Method not allowed.' },
        })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: { message: `An error ocurred, ${err}` },
    })
  }
}

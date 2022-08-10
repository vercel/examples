import { randomUUID } from 'crypto'
import { Todo } from '../../../../lib/db'

const todos: Todo[] = [
  { id: randomUUID(), title: 'Make a cup of tea' },
  { id: randomUUID(), title: 'Go out and exercise' },
  { id: randomUUID(), title: 'Continue writing my next blog post' },
]

export const todosBody = { todos }

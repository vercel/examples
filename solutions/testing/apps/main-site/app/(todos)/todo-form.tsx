'use client'

import { useRef } from 'react'
import { Input, Button } from '@vercel/examples-ui'
import { getUserId } from '#/actions/users'
import { addTodo } from '#/actions/todos'
import { tid } from '#/lib/data-testid'
import { useTodos } from './todos-context'

export function TodoForm() {
  const { todos, loading, optimisticUpdate } = useTodos()
  const formRef = useRef<HTMLFormElement>(null)
  const addTodoAction = async (formData: FormData) => {
    const todo = {
      user_id: (await getUserId())!,
      title: formData.get('title') as string,
    }

    optimisticUpdate([
      ...todos,
      {
        id: Math.random(),
        done: false,
        created_at: new Date(),
        updated_at: new Date(),
        ...todo,
      },
    ])
    formRef.current!.reset()
    await addTodo(todo)
  }

  return (
    <form
      ref={formRef}
      className="flex"
      data-testid={tid('todos-page', 'new-todo-form')}
      action={addTodoAction}
    >
      <Input name="title" placeholder="What needs to be done?" required />
      <Button type="submit" className="ml-4" width="120px" loading={loading}>
        Add Todo
      </Button>
    </form>
  )
}

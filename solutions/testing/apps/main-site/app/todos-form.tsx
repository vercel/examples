import { Input, Button } from '@vercel/examples-ui'
import { getUserId } from '#/actions/users'
import { addTodo } from '#/actions/todos'
import { tid } from '#/lib/data-testid'

export function TodosForm() {
  const addTodoAction = async (formData: FormData) => {
    'use server'

    await addTodo({
      userId: (await getUserId())!,
      title: formData.get('title') as string,
    })
  }

  return (
    <form
      className="flex"
      data-testid={tid('todos-page', 'new-todo-form')}
      action={addTodoAction}
    >
      <Input name="title" placeholder="What needs to be done?" required />
      <Button type="submit" className="ml-4" width="120px">
        Add Todo
      </Button>
    </form>
  )
}

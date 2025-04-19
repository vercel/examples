import { Button } from '@vercel/examples-ui'
import { getUser, getUserId, logout } from '#/actions/users'

export async function LogoutForm() {
  const logoutAction = async () => {
    'use server'
    await logout()
  }
  const userId = await getUserId()
  const user = userId && (await getUser(userId))
  const { username } = user || {}

  return (
    <div className="flex items-center">
      <p>You have logged in as {username}</p>
      <form action={logoutAction}>
        <Button type="submit" variant="secondary" className="ml-4">
          Logout
        </Button>
      </form>
    </div>
  )
}

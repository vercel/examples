import { Button } from '@vercel/examples-ui'
import { logout } from '#/actions/users'

export function LogoutForm() {
  const logoutAction = async () => {
    'use server'
    await logout()
  }

  return (
    <div className="flex items-center">
      <p>You have logged in as Luis</p>
      <form action={logoutAction}>
        <Button
          type="submit"
          variant="secondary"
          className="ml-4"
          // loading={loading}
        >
          Logout
        </Button>
      </form>
    </div>
  )
}

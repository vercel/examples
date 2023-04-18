import { Button } from '@vercel/examples-ui'

type Props = {
  loading?: boolean
  disabled?: boolean
}

/**
 * Simple button to show the usage of Storybook
 */
export const SignupButton = ({ loading, disabled }: Props) => (
  <Button type="submit" loading={loading} disabled={disabled}>
    Signup
  </Button>
)

import type { Meta, StoryObj } from '@storybook/react'
import { SignupButton } from './signup-button'

const meta: Meta<typeof SignupButton> = {
  title: 'Signup Button',
  component: SignupButton,
}

export default meta

type Story = StoryObj<typeof SignupButton>

export const Primary: Story = {
  args: {
    loading: false,
    disabled: false,
  },
}

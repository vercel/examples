import type { Meta, StoryObj } from '@storybook/react'
import { SubmitButton } from './submit-button'

const meta: Meta<typeof SubmitButton> = {
  title: 'Signup Button',
  component: SubmitButton,
}

export default meta

type Story = StoryObj<typeof SubmitButton>

export const Primary: Story = {
  args: {
    children: 'Signup',
  },
}

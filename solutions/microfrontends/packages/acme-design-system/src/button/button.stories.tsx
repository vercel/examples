import type { Meta, StoryObj } from '@storybook/react'
import Button from './button'

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'This is a button!',
  },
}

export const Secondary = {
  args: {
    secondary: true,
    children: 'This is a button!',
  },
}

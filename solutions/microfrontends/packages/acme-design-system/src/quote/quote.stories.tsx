import type { Meta, StoryObj } from '@storybook/react'
import Quote from './quote'

const meta: Meta<typeof Quote> = {
  title: 'Quote',
  component: Quote,
}

export default meta

type Story = StoryObj<typeof Quote>

export const Default: Story = {
  args: {
    children: 'This is a quote',
  },
}

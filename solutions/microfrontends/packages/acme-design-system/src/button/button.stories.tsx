import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button } from '@acme/design-system'
import '@vercel/examples-ui/globals.css'

export default {
  title: 'button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = { children: 'This is a button!' }

export const Secondary = Template.bind({})
Secondary.args = { children: 'This is a button!', secondary: true }

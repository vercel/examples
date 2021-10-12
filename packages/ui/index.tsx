import { FC, ComponentType } from 'react'

export { default as Layout } from './layout'
export { default as Text } from './text'
export { default as Input } from './input'
export { default as Button } from './button'
export { default as LoadingDots } from './loading-dots'
export { default as Link } from './link'
export { default as Code } from './code'

const Noop: FC = ({ children }) => <>{children}</>

export const getLayout = (Component: ComponentType<any>) =>
  (Component as any).Layout || Noop

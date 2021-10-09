import { FC, ComponentType } from 'react'

export { default as Layout } from './layout'
export { default as Text } from './text/text'
export { default as Input } from './input/input'
export { default as Button } from './button/button'
export { default as LoadingDots } from './loading-dots/loading-dots'

const Noop: FC = ({ children }) => <>{children}</>

export const getLayout = (Component: ComponentType<any>) =>
  (Component as any).Layout || Noop

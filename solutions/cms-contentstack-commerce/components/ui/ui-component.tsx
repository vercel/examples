import { UIComponentTypes } from '@lib/types'
import { Grid } from './grid'
import { Hero } from './hero'

type Props = {
  componentType: UIComponentTypes
  componentVariant?: string
  data?: any
  children?: any
  priority?: boolean
}

export const UIComponent = (props: Props) => {
  const { componentType = 'default', componentVariant, data, ...rest } = props

  const componentMap = {
    hero: Hero,
    grid: Grid,
    default: () => {
      console.error('Component Type not specified')
      return null
    },
  }

  const Component = componentMap[componentType]
  return <Component variant={componentVariant} data={data} {...rest} />
}

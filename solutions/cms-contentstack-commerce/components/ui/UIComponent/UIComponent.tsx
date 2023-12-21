import React from 'react'
import { Grid } from '@components/ui/grid'
import Hero from '@components/ui/Hero'

const UIComponent: React.FC<{
  componentType: UIComponentTypes
  componentVariant?: string
  data?: any
  children?: any
  priority?: boolean
}> = (props) => {
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

export default UIComponent

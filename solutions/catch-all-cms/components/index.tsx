import { FC, ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { CMSComponent } from 'lib/cms/types'
import { components as comps } from 'app/components'

// import LayoutA from './layouts/layout-a'

const components: typeof comps = {
  ...comps,
  // LayoutA,
  LayoutA: dynamic(() => import('./layouts/layout-a')),
}

export const RenderCMSComponent: FC<{
  component: CMSComponent
  children?: ReactNode
  rootProps?: { children?: ReactNode }
}> = ({ component, rootProps }) => {
  if (typeof component === 'string') {
    return <>{component}</>
  }
  if (component.name === 'children') {
    return <>{rootProps?.children || null}</>
  }

  const Component = components[component.name]

  // If there's no component, this is an error in either the CMS or
  // in the app, either way we don't want to throw an error but
  // render `null` instead, to avoid having a broken UI.
  if (!Component) {
    // Instead of a log this should do proper reporting
    console.error(`Component ${component.name} not found`)
    return null
  }

  return (
    <Component {...component.props}>
      {component.children?.map((child, i) => (
        <RenderCMSComponent key={i} component={child} rootProps={rootProps} />
      ))}
    </Component>
  )
}

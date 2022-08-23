import { Fragment, ComponentType, FC, ReactNode } from 'react'
// import dynamic from 'next/dynamic'
// The usage of dynamic like this is temporal
import dynamic from 'next/dist/client/components/shared/dynamic'
import { CMSComponent } from 'lib/cms/types'
import { H1, Paragraph, Container } from './core.server'

const components: Record<string, ComponentType<any> | undefined> = {
  // Core components, these are not loaded by next/dynamic as they're
  // used frequently, and could be used by other dynamic components too.
  Fragment,
  H1,
  Paragraph,
  Container,

  LayoutA: dynamic(() => import('./layouts/layout-a.server')),
  HeaderA: dynamic(() => import('./headers/header-a.server')),
  VariantA: dynamic(() => import('./variants/variant-a.server')),
  VariantB: dynamic(() => import('./variants/variant-b.server')),
  VariantC: dynamic(() => import('./variants/variant-c.server')),
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

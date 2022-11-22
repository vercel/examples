import { Fragment, ComponentType, FC, ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { CMSComponent } from 'lib/cms/types'
import { H1, Paragraph, Container } from './core'

import LayoutA from './layouts/layout-a'
import HeaderA from './headers/header-a'
import VariantA from './variants/variant-a'
import VariantB from './variants/variant-b'
import VariantC from './variants/variant-c'

export const components: Record<string, ComponentType<any> | undefined> = {
  // Core components, these are not loaded by next/dynamic as they're
  // used frequently, and could be used by other dynamic components too.
  Fragment,
  H1,
  Paragraph,
  Container,
  LayoutA,
  HeaderA,
  VariantA,
  VariantB,
  VariantC,
  // LayoutA: dynamic(() => import('./layouts/layout-a')),
  // HeaderA: dynamic(() => import('./headers/header-a')),
  // VariantA: dynamic(() => import('./variants/variant-a')),
  // VariantB: dynamic(() => import('./variants/variant-b')),
  // VariantC: dynamic(() => import('./variants/variant-c')),
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

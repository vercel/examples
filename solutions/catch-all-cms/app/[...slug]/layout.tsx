/* eslint-disable @next/next/no-head-element */
import { FC, experimental_use as use } from 'react'
import cms from 'lib/cms'
import { RenderCMSComponent } from '../components/index.server'

async function getPageBySlug(slug: string[]) {
  const page = await cms.getPageBySlug(`/${slug.join('/')}`)
  // The slug isn't used to get the layout because that can imply that every
  // page can decide its own layout, which wouldn't be true as layouts don't
  // change between its nested pages.
  //
  // Here the layout is still dynamic, but we load it using an identifier
  // different than the page slug.
  const layout = await cms.getLayoutByName('layout-a')
  return layout
}

const RootLayout: FC<any> = (props) => {
  const {
    children,
    params: { slug },
  } = props
  const layout = use(getPageBySlug(slug))

  return <RenderCMSComponent component={layout!} rootProps={{ children }} />
}

export default RootLayout

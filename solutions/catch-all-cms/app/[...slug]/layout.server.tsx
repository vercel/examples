/* eslint-disable @next/next/no-head-element */
import type { FC, ReactNode } from 'react'
import cms from 'lib/cms'
import type { PropsType } from 'lib/types'
import { RenderCMSComponent } from '../components/index.server'

export async function getStaticProps() {
  // The slug isn't used to get the layout because that can imply that every
  // page can decide its own layout, which wouldn't be true as layouts don't
  // change between its nested pages.
  //
  // Here the layout is still dynamic, but we load it using an identifier
  // different than the page slug.
  const layout = await cms.getLayoutByName('layout-a')
  return { props: { layout } }
}

const RootLayout: FC<
  PropsType<typeof getStaticProps> & { children: ReactNode }
> = ({ layout, children }) => (
  <RenderCMSComponent component={layout!} rootProps={{ children }} />
)

export default RootLayout

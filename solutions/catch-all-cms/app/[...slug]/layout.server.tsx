/* eslint-disable @next/next/no-head-element */
import type { FC, ReactNode } from 'react'
import cms from 'lib/cms'
import type { PropsType } from 'lib/types'
import { RenderCMSComponent } from '../components/index.server'

export async function getStaticProps({
  params,
}: {
  params: { slug: string[] }
}) {
  const slug = `/${params.slug.join('/')}`
  const layout = await cms.getLayoutBySlug(slug)

  return { props: { layout } }
}

const RootLayout: FC<
  PropsType<typeof getStaticProps> & { children: ReactNode }
> = ({ layout, children }) => (
  <RenderCMSComponent component={layout!} rootProps={{ children }} />
)

export default RootLayout

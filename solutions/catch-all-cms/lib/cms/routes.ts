import type { CMSComponentMap } from './types'

/**
 * List of components that can be used in the CMS and sent to the app.
 */
const components = {
  Fragment: { name: 'Fragment' },
  children: { name: 'children' },
  H1: { name: 'H1' },
  Paragraph: { name: 'Paragraph' },
  Container: { name: 'Container' },
  LayoutA: { name: 'LayoutA' },
  HeaderA: { name: 'HeaderA' },
  VariantA: { name: 'VariantA' },
  VariantB: { name: 'VariantB' },
  VariantC: { name: 'VariantC' },
}

export const layouts: CMSComponentMap = {
  'layout-a': {
    ...components.LayoutA,
    props: {
      title: 'Pagination with SSG',
      path: 'solutions/pagination-with-ssg',
      description: 'Learn how to do pagination with SSG',
    },
    children: [
      {
        ...components.Container,
        children: [
          components.HeaderA,
          {
            ...components.H1,
            children: ['Single Page CMS'],
          },
          {
            ...components.Paragraph,
            children: ['Everything in this page is rendered from the CMS.'],
          },
          components.children,
        ],
      },
    ],
  },
}

/**
 * A CMS has its own way of storing records ("routes"), this is they way
 * we store records of new pages in this example.
 */
export const routes: CMSComponentMap = {
  '/header-a/a': {
    ...components.Fragment,
    children: [
      { ...components.VariantA, children: ['Variant A'] },
      { ...components.VariantB, children: ['Variant B'] },
      { ...components.VariantC, children: ['Variant C'] },
    ],
  },
}

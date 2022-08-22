import type { CMSRoutes } from './types'

/**
 * List of components that can be used in the CMS and sent to the app.
 */
const components = {
  Fragment: { name: 'Fragment' },
  children: { name: 'children' },
  H1: { name: 'H1' },
  Paragraph: { name: 'Paragraph' },
  Container: { name: 'Container' },
  Layout: { name: 'Layout' },
  HeaderA: { name: 'HeaderA' },
  VariantA: { name: 'VariantA' },
  VariantB: { name: 'VariantB' },
  VariantC: { name: 'VariantC' },
}

/**
 * A CMS has its own way of storing records ("routes"), this is they way
 * we store records of new pages in this example.
 */
const routes: CMSRoutes = {
  '/header-a/a': {
    layout: {
      ...components.Layout,
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
    page: {
      ...components.Fragment,
      children: [components.VariantA, components.VariantB, components.VariantC],
    },
  },
}

export default routes

import type { CMSRoutes } from './types'

/**
 * List of components that can be used in the CMS and sent to the app.
 */
const components = {
  Fragment: { name: 'Fragment' },
  children: { name: 'children' },

  H1: { name: 'H1' },
  Paragraph: { name: 'Paragraph' },
  Layout: { name: 'Layout' },
  Container: { name: 'Container' },
  HeaderA: { name: 'HeaderA' },
  A: { name: 'A' },
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
      children: [components.A],
    },
  },
}

export default routes

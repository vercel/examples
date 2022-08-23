import type { CMSComponent, CMSComponentMap } from './types'

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

const baseLayout = ({ header }: { header: CMSComponent }): CMSComponent => ({
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
        header,
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
})

/**
 * Layouts that can be used by the app
 */
export const layouts: CMSComponentMap = {
  'layout-a': baseLayout({
    header: {
      ...components.HeaderA,
      props: {
        title: 'Layout A',
        categories: [
          { text: 'layout-b', href: '/layout-b' },
          { text: 'layout-c', href: '/layout-c' },
        ],
      },
    },
  }),
  'layout-b': baseLayout({
    header: {
      ...components.HeaderA,
      props: {
        title: 'Layout B',
        categories: [
          { text: 'layout-a', href: '/' },
          { text: 'layout-c', href: '/layout-c' },
        ],
      },
    },
  }),
  'layout-c': baseLayout({
    header: {
      ...components.HeaderA,
      props: {
        title: 'Layout C',
        categories: [
          { text: 'layout-a', href: '/' },
          { text: 'layout-b', href: '/layout-b' },
        ],
      },
    },
  }),
}

// Every layout represents a different catch all route in the app.
const catchAllKeys = Object.keys(layouts)

/**
 * A CMS has its own way of storing records ("routes"), this is they way
 * we store records of new pages in this example.
 */
export const routes = catchAllKeys.reduce<CMSComponentMap>(
  (acc, layoutKey, i) => {
    const pageKey = layoutKey.replace('layout-', '')
    // The first layout is the root catch-all and we don't need to add the layout key prefix.
    const slug = i > 0 ? `/${layoutKey}` : `/${pageKey}`

    // The parent route (e.g /a) includes a link to multiple sub pages.
    acc[slug] = {
      ...components.Fragment,
      children: [
        {
          ...components.VariantA,
          children: ['Variant A'],
          props: {
            categories: [{ text: `go to ${slug}/a`, href: `${slug}/a` }],
          },
        },
        {
          ...components.VariantB,
          children: ['Variant B'],
          props: {
            categories: [{ text: `go to ${slug}/b`, href: `${slug}/b` }],
          },
        },
        {
          ...components.VariantC,
          children: ['Variant C'],
          props: {
            categories: [{ text: `go to ${slug}/c`, href: `${slug}/c` }],
          },
        },
      ],
    }

    // Add a route per component variant.
    catchAllKeys.forEach((key) => {
      const pageKey = key.replace('layout-', '')

      // For the route of the variant (e.g `/a/b`) we'll only include the selected variant
      // and it'll link to its parent route (e.g `/a`).
      acc[`${slug}/${pageKey}`] = {
        ...components.Fragment,
        children: [
          {
            ...components.VariantA,
            children: [`Variant ${pageKey.toUpperCase()}`],
            props: {
              categories: [{ text: `go to ${slug}`, href: slug }],
            },
          },
        ],
      }
    })

    return acc
  },
  {}
)

console.log('SS', JSON.stringify(routes, null, 2))

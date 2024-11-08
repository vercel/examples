import { Page, Text, Code, Link, Snippet } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">
          Using parallel routes to display route related information in layouts
        </Text>
        <Text>
          Breadcrumbs can be found in e-commerce, blogs, documentation, and many
          other types of websites. They are a great way to help users understand
          where they are in the website hierarchy and navigate back to previous
          pages. If one should say where they should be placed at code level,
          it&apos;s probably in the layout shared between all the pages that has
          it. But sometimes it&apos;s not that simple. To show information about
          the current route, you might need information from the url, like the
          params, which is not available in layouts.
        </Text>
        <Text>
          A solution for this might be create the breadcrumbs component as a
          client component, use a hook to get the params and then display it.
          But, what happen if the parameter in the url is a slug, and we have to
          first get the display value for it from a service before showing it on
          the breadcrumb? Because it&apos;s a client component we have to waiy
          for the server to send the response, for the javascript to download
          and execute, for the call to the slug service to complete and then
          finally display that breadcrumb to the user.
        </Text>
        <Text>
          Wow, that sounds like a lot of work right? Well, or we can use a
          parallel route 👇
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Pages as components</Text>
        <Text>
          You can image parallel routes as slots in your page. Your layout
          receives a prop <Code>children</Code> that has the content of the
          route to display. With parallel routes you can have more of this slots
          where you decide what to display in each one. And, like pages, they
          receive the same props, including the params.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Let&apos;s do it</Text>
        <Text>
          You were given a task to update a bakery blog project. You have to
          show a breadcrumb with the category and its icon and the post title on
          it.
        </Text>
        <Text>
          You can&apos;t touch the <Code>page</Code> file because it&apos;s
          being handled by a CMS so you can only change the layout or add new
          files to add the breadcrumb. Let&apos;s start by creating a parallel
          route for our breadcrumb:
        </Text>
        <Snippet>
          {`|/app
|__/[category]
|____/[slug]
|______/page.js
|__/layout.js
|__/@breadcrumb
|____/[category]
|______/[slug]
|________/page.js`}
        </Snippet>
        <Text>
          Now we have a parallel route called <Code>breadcrumb</Code> that will
          match when someone requests the <Code>/category/slug</Code> page.
          Let&apos;s add the parallel route to our layout.
        </Text>
        <Snippet>
          {`
export default function RootLayout({ children, breadcrumb }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Navbar />
          {breadcrumb}
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
`}
        </Snippet>
        <Text>
          In our <Code>/@breadcrumb/[category]/[slug]/page.js</Code> let&apos;s
          get category and slug, fetch the display name and display them on
          screen.
        </Text>
        <Snippet>
          {`export default async function BreadcrumbPage({ params: { category, slug } }) {
  const displayName = await fetch(\`.../\${category}/\${slug}\`);

  return (
    <nav className="flex gap-4 text-sm opacity-80">
      <span className="capitalize">{\` > \${category}\`}</span>
      <span> / </span>
      <span>{displayName}</span>
    </nav>
  );
}
`}
        </Snippet>
        <Text>
          Now, Next.js will send the response as soon as it&apos;s ready on the
          server. Also, as this is a page, we can define a{' '}
          <Code>loading.js</Code> to display a skeleton while we fetch the
          display name. You can find a working example in the{' '}
          <Link href="/demo/pastries/key-lime-pie">
            <Code>/demo</Code>
          </Link>{' '}
          route.
        </Text>
      </section>
    </Page>
  )
}

import { Page, Text, Code, Link, Snippet } from '@vercel/examples-ui'
import { Navbar } from '@acme/components/navbar'
import { Button, Quote } from '@acme/design-system'
import { ColoredButton } from './components/colored-button'

export default function Home(): React.ReactNode {
  return (
    <Page>
      <Navbar />
      <Text variant="h1" className="mb-6">
        Microfrontends
      </Text>
      <Text className="mb-4">
        In this microfrontends app we have a monorepo using{' '}
        <a
          className="text-link hover:text-link-light transition-colors"
          href="https://turbo.build/repo/docs"
        >
          Turborepo
        </a>{' '}
        with multiple packages, each using TypeScript and going through a
        different microfrontend technique:
      </Text>
      <Text variant="h2" className="mt-10 mb-6">
        apps/main
      </Text>
      <Text className="mb-4">
        This is the current Next.js site you&apos;re looking at!
      </Text>
      <Text className="mb-4">
        You&apos;re currently looking at the Home page, defined in{' '}
        <Code>apps/main/app/page.tsx</Code>.
      </Text>
      <Text variant="h2" className="mt-10 mb-6">
        packages/acme-design-system
      </Text>
      <Text className="mb-4">
        Example of how you could build a Design System, it&apos;s a set of React
        Components that ship with CSS Modules.
      </Text>
      <Button className="mb-4">This is a button</Button>
      <Quote className="mb-4">
        This is the <Code>Quote</Code> component in the design system.
      </Quote>
      <Text variant="h2" className="mt-10 mb-6">
        packages/acme-components
      </Text>
      <Text className="mb-4">
        Works in the same way as <Code>packages/acme-design-system</Code> but
        instead of building a design system it&apos;s about having shared
        components that can be used across applications such as the navigation
        bar.
      </Text>
      <Text variant="h2" className="mt-10 mb-6">
        packages/acme-utils
      </Text>
      <Text className="mb-4">This package exports utility functions.</Text>
      <Text className="mb-4">
        The button below uses an utility function from this package to change
        its color when clicked:
      </Text>
      <ColoredButton />
      <Text variant="h2" className="mt-10 mb-6">
        apps/docs (Multi-Zones)
      </Text>
      <Text className="mb-4">
        Next.js application that takes care of handling the pages for{' '}
        <Code>/docs/**</Code>.
      </Text>
      <Text className="mb-4">
        This example shows how Multi-Zones can be managed in Next.js to merge
        multiple Next.js applications in the same domain.
      </Text>
      <Text className="mb-4">
        In a Multi-Zones set-up, different paths can be served by different
        applications. However, when a user navigates between those different
        applications, there is a hard navigation and the assets of the other
        application have to be downloaded again. Multi-Zones are therefore good
        for sites where there are logical separations of pages that a user
        doesn&apos;t navigate between often.
      </Text>
      <Text className="mb-4">
        In local development, you can run some zones locally or point them to
        production. When pointing a zone to production, code changes won&apos;t
        be reflected unless you also run that application locally.
      </Text>
      <Text variant="h2" className="mt-10 my-6">
        packages/acme-storybook
      </Text>
      <Text className="mb-4">
        This packages takes the stories in{' '}
        <Code>packages/acme-design-system</Code> and opens them in{' '}
        <Link href="https://storybook.js.org/" target="_blank">
          Storybook
        </Link>
        .
      </Text>
      <Text variant="h2" className="mt-10 my-6">
        packages/eslint-config-acme
      </Text>
      <Text className="mb-4">
        Exports the Eslint configuration that will be used by all apps and
        packages:
      </Text>
      <Snippet className="mb-4">{`module.exports = {
  extends: ['next', 'turbo', 'prettier'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
}`}</Snippet>
      <Text className="mb-4">
        Every package then has a <Code>.eslintrc</Code> with:
      </Text>
      <Snippet className="mb-4">{`module.exports = {
  root: true,
  extends: ['acme'],
}`}</Snippet>
    </Page>
  )
}

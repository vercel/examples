# UI components for Vercel examples

The UI components exported here are being used in many of the examples in this repository. They're built with React, TypeScript, and Tailwind CSS.

## How to use

### 1. Package installation

Install the package with npm, pnpm, or yarn:

```bash
npm i @vercel/examples-ui
# or
pnpm i @vercel/examples-ui
# or
yarn add @vercel/examples-ui
```

The package relies on Tailwind picking up its styles, so if you don't have Tailwind CSS already install it like so:

```bash
npm i tailwindcss postcss autoprefixer
# or
pnpm i tailwindcss postcss autoprefixer
# or
yarn add tailwindcss postcss autoprefixer
```

### 2. Tailwindcss setup

To allow Tailwind CSS to know which styles to pick up, and to also add our design, Open `tailwind.config.js` in your app and add the following preset and content path:

```js
module.exports = {
  presets: [require('@vercel/examples-ui/tailwind')],
  content: ['./node_modules/@vercel/examples-ui/**/*.js'],
}
```

### 3. PostCSS setup

You'll need to have a `postcss.config.js` file with:

```js
// If you want to use other PostCSS plugins, see the following:
// https://tailwindcss.com/docs/using-with-preprocessors
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 4. Adding global styles

#### In the App Router

Open any layout or page where you want the global styles to be applied and add the following import:

```tsx
import '@vercel/examples-ui/globals.css'
```

#### In pages

Open `pages/_app.tsx` and add the following import to include the global CSS of the package and Tailwind base CSS:

```tsx
import '@vercel/examples-ui/globals.css'
```

If you don't have a `pages/_app.tsx` already it should look like this:

```tsx
import type { AppProps } from 'next/app'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

Now, if I wanted to add the default layout used in all examples, I can import the `Layout` component and use it inside `_app.tsx` like so:

```tsx
import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="API Rate Limiting with Upstash"
      path="edge-middleware/api-rate-limit-upstash"
    >
      <Component {...pageProps} />
    </Layout>
  )
}
```

## Contributing

Install packages from the root of the repo:

```bash
pnpm build
```

To watch for changes, navigate to this folder in your terminal and run:

```bash
pnpm build:swc -w
```

If you want to make an update to the package, go to an example and install it with npm:

```bash
npm i $(npm pack ../../internal/packages/ui | tail -1)
```

> Make sure to have dependencies installed in `internal/packages/ui` or otherwise the symlink won't resolve imports.

### Creating a changeset

To create a changeset, run:

```bash
pnpm changeset
```

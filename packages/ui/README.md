# UI components for Vercel examples

The UI components exported here are being used in every example that has an UI. The package ships React components with Tailwind CSS and requires the following dev dependencies to exist in the project:

- TypeScript
- Tailwindcss
- PostCSS

## How to use

### 1. Package installation

Install the package with npm or yarn:

```bash
npm i @vercel/examples-ui
// or
yarn add @vercel/examples-ui
```

If the app doesn't already have the required dev dependencies install them like so:

```bash
npm i typescript tailwindcss postcss autoprefixer
// or
yarn add typescript tailwindcss postcss autoprefixer
```

### 2. Tailwindcss setup

Because **the package is untranspiled**, in order to get it working in your next.js app you'll need to add the following to `next.config.js`:

```js
const withTM = require('@vercel/examples-ui/transpile')()

module.exports = withTM({
  // Your next.js config
})
```

Open the `tailwind.config.js` file in your app and add the following preset and content path:

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

Open `_app.tsx` and add the following import to include the global CSS of the package and Tailwind base CSS:

```tsx
import '@vercel/examples-ui/globals.css'
```

If you don't have a `_app.tsx` already it should look like this:

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
      path="edge-functions/api-rate-limit"
    >
      <Component {...pageProps} />
    </Layout>
  )
}
```

## Contributing

You can build the package with:

```bash
pnpm build
```

To watch for changes:

```bash
pnpm build -w
```

If you want to make an update to the package, go to an example and install it with npm:

```bash
npm i ../../packages/ui
```

npm will add a symlink and making changes to `packages/ui` will reload the app, once you're done feel free to create a PR!

> Make sure to have dependencies installed in `packages/ui` with `pnpm i` or otherwise the symlink won't resolve imports

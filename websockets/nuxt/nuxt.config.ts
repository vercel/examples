export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'theme-color', content: '#00dc82' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  experimental: {
    // Nuxt 5 turns off Nitro's v2-style auto-imports by default, which drops the
    // `#imports` virtual that prebuilt server code in node_modules (e.g.
    // @nuxt/icon's API route) still imports from. Re-enable it so those modules
    // resolve under the Nitro v3 builder.
    nitroAutoImports: true,
  },

  compatibilityDate: 'latest',

  // Nitro v3 has native crossws WebSocket support that works in local dev and on
  // Vercel — the Vercel preset bridges Vercel's runtime socket upgrade into
  // crossws via `crossws/adapters/vercel`, so a single handler powers every
  // environment. (Requires Nitro >= 3.0.260610-beta.)
  nitro: {
    experimental: {
      websocket: true,
    },
  },
})

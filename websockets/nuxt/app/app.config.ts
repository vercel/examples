export default defineAppConfig({
  site: {
    title: 'Nuxt + Vercel WebSockets Starter',
    description:
      'A minimal Nuxt starter for Vercel WebSockets. Live cursors, presence, and reactions over a single realtime connection — powered by the Vercel Functions WebSocket beta.',
    repo: 'https://github.com/vercel/examples/tree/main/websockets/nuxt',
    deployUrl:
      'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fwebsockets%2Fnuxt&project-name=nuxt-websockets&repository-name=nuxt-websockets',
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'neutral',
    },
    button: {
      slots: {
        base: 'active:translate-y-px transition-transform duration-200',
      },
    },
  },
})

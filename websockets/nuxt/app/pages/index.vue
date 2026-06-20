<script setup lang="ts">
definePageMeta({
  colorMode: 'dark',
})

const { site } = useAppConfig()

useSeoMeta({
  title: site.title,
  description: site.description,
  ogTitle: site.title,
  ogDescription: site.description,
  ogImage: '/og.png',
  twitterCard: 'summary_large_image',
})

const rt = useRealtime()

const features = [
  {
    icon: 'i-lucide-mouse-pointer-2',
    title: 'Live cursors',
    description:
      'Every pointer move is broadcast over a single WebSocket and rendered for everyone in the room.',
  },
  {
    icon: 'i-lucide-users',
    title: 'Presence',
    description:
      'Join and leave events keep an accurate, shared roster of who is currently connected.',
  },
  {
    icon: 'i-lucide-sparkles',
    title: 'Reactions',
    description:
      'Ephemeral emoji bursts fan out to everyone in the room over the same WebSocket connection.',
  },
]
</script>

<template>
  <div class="relative min-h-screen">
    <HeroBackdrop />

    <header class="relative z-10 mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5">
      <div class="flex items-center gap-2 font-medium text-highlighted">
        <UIcon name="i-simple-icons-nuxtdotjs" class="size-6 text-primary" />
        <span class="text-muted">×</span>
        <UIcon name="i-simple-icons-vercel" class="size-5" />
        <span class="hidden text-sm sm:inline">WebSockets</span>
      </div>

      <div class="flex items-center gap-1.5">
        <UButton label="Deploy with Vercel" color="neutral" variant="solid" icon="i-simple-icons-vercel" :to="site.deployUrl" target="_blank" />
      </div>
    </header>

    <main class="relative z-10 mx-auto max-w-5xl px-4 pb-20">
      <section class="flex flex-col items-center gap-5 py-10 text-center sm:py-14">
        <UBadge color="primary" variant="subtle" class="rounded-full">
          Vercel Functions · WebSockets Beta
        </UBadge>
        <h1 class="max-w-2xl text-4xl font-semibold tracking-tight text-highlighted sm:text-5xl">
          Realtime, served from a Vercel Function
        </h1>
        <p class="max-w-xl text-balance text-muted">
          A minimal Nuxt starter for the Vercel WebSockets beta. Move your
          cursor below — everything you see is live presence, cursors, and
          reactions over one connection.
        </p>
        <PresenceBar :rt="rt" />
      </section>

      <LiveCanvas :rt="rt" />

      <section class="mt-16 grid gap-6 sm:grid-cols-3">
        <div v-for="feature in features" :key="feature.title" class="flex flex-col gap-2 rounded-lg border border-muted bg-default p-5">
          <UIcon :name="feature.icon" class="size-5 text-primary" />
          <h3 class="font-medium text-highlighted">
            {{ feature.title }}
          </h3>
          <p class="text-sm text-muted">
            {{ feature.description }}
          </p>
        </div>
      </section>
    </main>

    <footer class="relative z-10 border-t border-default">
      <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:flex-row">
        <p>
          Built with
          <ULink :to="`https://nuxt.com`" target="_blank" class="text-highlighted">Nuxt</ULink>
          and
          <ULink to="https://vercel.com/docs/functions/websockets" target="_blank" class="text-highlighted">Vercel WebSockets</ULink>.
        </p>

        <UButton :to="site.repo" target="_blank" icon="i-simple-icons-github" label="vercel/examples" color="neutral" variant="outline" />
      </div>
    </footer>
  </div>
</template>
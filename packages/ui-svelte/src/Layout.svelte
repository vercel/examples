<script>
  import './app.css'
  import Nav from './Nav.svelte'
  import Vercel from './Vercel.svelte'

  export let title = 'Vercel Examples'
  export let description = 'Lear how to use Vercel Middleware in Sveltekit'
  export let path = ''
</script>

<svelte:head>
  <title>{title} - Vercel Examples</title>
  <meta name="description" content={description} />
  <link rel="icon" href="/favicon.ico" />
</svelte:head>
<div class="mx-auto h-screen flex flex-col">
  <Nav {path} />
  <div class="px-8 bg-accents-0">
    <main class="w-full max-w-3xl mx-auto py-16">
      <slot />
    </main>
  </div>
  <footer
    class="py-10 w-full mt-auto border-t flex items-center justify-center bg-accents-1 z-20"
  >
    <span class="text-primary">Created by</span>
    <a
      href="https://vercel.com"
      aria-label="Vercel.com Link"
      target="_blank"
      rel="noreferrer"
      class="text-black"
    >
      <Vercel className="inline-block h-6 ml-3 text-primary" />
    </a>
  </footer>
</div>

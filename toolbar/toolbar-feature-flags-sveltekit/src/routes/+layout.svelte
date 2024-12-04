<script lang="ts">
  import { mountVercelToolbar } from '@vercel/toolbar/vite'
  import { onMount } from 'svelte'
  import Footer from './Footer.svelte'

  let { children } = $props()

  // This always shows the toolbar in production. In your project, you probably
  // want to show it only under certain conditions.
  onMount(() => mountVercelToolbar())
</script>

<main>
  {@render children?.()}
</main>
<Footer />

<style>
  :globa(html, body) {
    height: 100%;
  }

  :global(body) {
    --fg: black;
    --bg: rgb(250, 250, 250);
    --svelte: #ff3e00;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: var(--bg);
    color: var(--fg);
    overflow: hidden;
  }

  main {
    margin: 0 auto;
    max-width: 60rem;
    padding: 2rem;
  }

  @media (prefers-color-scheme: dark) {
    :global(body) {
      --fg: white;
      --bg: black;
    }
  }
</style>

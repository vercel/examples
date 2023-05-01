<script>
  export let data
  function refreshPage() {
    location.reload()
  }
</script>

<main
  class="relative flex flex-col items-center justify-center min-h-screen py-10"
>
  <a
    href="https://vercel.com"
    class="px-6 py-2 text-sm font-medium text-gray-600 transition-all rounded-full shadow-sm bg-white/30 dark:bg-white/80 ring-1 ring-gray-900/5 dark:text-black hover:shadow-lg active:shadow-sm"
  >
    Deploy your own to Vercel
  </a>
  <h1
    class="pt-4 pb-8 bg-gradient-to-br dark:from-white from-black via-[#707070] to-[#ffffff] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
  >
    Vercel KV
  </h1>
  <div
    class="flex flex-col items-center w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
  >
    <div class="mb-6 text-lg text-center">
      Displayed below is the total number of page views for this demo. Refresh
      the page and watch it increase!
    </div>
    <button
      on:click={refreshPage}
      class="mb-6 font-bold underline opacity-70 hover:opacity-100"
    >
      Refresh Page
    </button>
    <div class="text-5xl font-bold">
      {data?.pageVisits}
    </div>
  </div>
  <div
    class="w-full max-w-lg mt-6 font-light text-center text-gray-600 dark:text-gray-300"
  >
    Simple hello world demo of
    <a
      href="https://vercel.com/kv"
      class="font-medium underline transition-colors underline-offset-4 dark:hover:text-white hover:text-black"
    >
      Vercel KV
    </a>
    <div class="flex items-center justify-center my-2">
      <span>Built with</span>
      <a
        href="https://kit.svelte.dev/"
        class="flex items-center font-medium underline transition-colors underline-offset-4 dark:hover:text-white hover:text-black"
      >
        <img src="svelte_logo.png" alt="svelte logo" class="h-6 mx-2" />
        <p>SvelteKit</p>
      </a>
      .
    </div>
  </div>
  <div class="flex flex-col grow">
    <a href="https://vercel.com">
      <img
        src="/vercel.svg"
        alt="Vercel Logo"
        class="my-2 text-white dark:text-white"
        width={100}
        height={24}
      />
    </a>
    <a
      href="https://github.com/vercel/examples/tree/main/storage/kv-redis-sveltekit"
      class="flex items-center h-8 mt-auto space-x-2 bottom-20 right-20"
    >
      <img src="/github.svg" alt="GitHub Logo" class="h-6 dark:invert" />
      <p class="font-light">Source</p>
    </a>
  </div>
</main>

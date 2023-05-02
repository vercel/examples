<script>
  import Table from '../lib/Table.svelte'
  export let data
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
    Postgres on Vercel
  </h1>
  <Table users={data?.users} duration={data?.duration} />
  <div
    class="w-full max-w-lg mt-6 font-light text-center text-gray-600 dark:text-gray-300"
  >
    Simple hello world demo of
    <a
      href="https://vercel.com/postgres"
      class="font-medium underline transition-colors underline-offset-4 dark:hover:text-white hover:text-black"
    >
      Vercel Postgres
    </a>
    <div class="flex items-center justify-center my-2">
      <span>Built with</span>
      <a
        href="https://kit.svelte.dev/"
        class="flex items-center font-medium underline transition-colors underline-offset-4 dark:hover:text-white hover:text-black"
      >
        <span class="flex justify-center w-8">
          <img src="svelte_logo.png" alt="svelte logo" class="h-6 mx-2" />
        </span>
        <p>SvelteKit</p>
      </a>
      .
    </div>
  </div>
  <div class="flex flex-col items-center grow">
    <a href="https://vercel.com">
      <img
        src="/vercel.svg"
        alt="Vercel Logo"
        class="h-4 my-4 dark:invert"
        width={100}
        height={24}
      />
    </a>
    <a
      href="https://github.com/vercel/examples/tree/main/storage/postgres-sveltekit"
      class="flex items-center h-8 mt-auto space-x-2 bottom-20 right-20"
    >
      <img src="/github.svg" alt="GitHub Logo" class="h-6 dark:invert" />
      <p class="font-light">Source</p>
    </a>
  </div>
</main>

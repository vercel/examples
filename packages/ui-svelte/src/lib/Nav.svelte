<script>
  export let path = ''
  $: displayPath = ['Vercel Examples']
    .concat(path?.split('/').filter(Boolean) || [])
    .join(' / ')
</script>

<nav class="root border-b border-gray-200 py-5 relative z-20 bg-white">
  <div
    class="flex items-center lg:px-6 px-8  py-5 relative z-20 bg-white container"
  >
    <div class="flex flex-row items-center">
      <a href="/">
        <span>
          <svg height="26" viewBox="0 0 75 65" fill="#000">
            <title>Vercel Logo</title>
            <path d="M37.59.25l36.95 64H.64l36.95-64z" />
          </svg>
        </span>
      </a>
      <ul class="flex items-center content-center">
        <li class="ml-2 text-gray-200">
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            shapeRendering="geometricPrecision"
          >
            <path d="M16.88 3.549L7.12 20.451" />
          </svg>
        </li>
        <li class="font-medium" style={{ letterSpacing: '.01px' }}>
          <a href="/">
            {displayPath}
          </a>
        </li>
      </ul>
    </div>
    <div class="flex-1 justify-end hidden md:flex">
      <nav class="flex-row inline-flex items-center">
        <span
          class="ml-2 h-full flex items-center cursor-not-allowed text-accents-5"
        >
          <a
            variant="ghost"
            Component="a"
            href="https://github.com/vercel/examples/tree/main"
          >
            More Examples →
          </a>
        </span>
        <span
          class="ml-2 h-full flex items-center cursor-not-allowed text-accents-5"
        />
      </nav>
    </div>
  </div>
</nav>

<style>
  .root {
    box-shadow: 0 0 15px 0 rgb(0 0 0 / 10%);
  }
</style>

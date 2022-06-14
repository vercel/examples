<script>
  import clsx from 'clsx'
  import Link from './Link.svelte'
  export let path = ''
  const displayPath = ['Vercel Examples']
    .concat(path?.split('/').filter(Boolean) || [])
    .join(' / ')
</script>

<nav class="root">
  <div class={clsx('flex items-center lg:px-6 px-8', 'container')}>
    <div class="flex flex-row items-center">
      <Link href="/">
        <span>
          <svg height="26" viewBox="0 0 75 65" fill="#000">
            <title>Vercel Logo</title>
            <path d="M37.59.25l36.95 64H.64l36.95-64z" />
          </svg>
        </span>
      </Link>
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
          <Link href="/" className="link">
            {displayPath}
          </Link>
        </li>
      </ul>
    </div>
    <div class="flex-1 justify-end hidden md:flex">
      <nav class="flex-row inline-flex items-center">
        <span
          class="ml-2 h-full flex items-center cursor-not-allowed text-accents-5"
        >
          <Link
            variant="ghost"
            Component="a"
            href="https://github.com/vercel/examples/tree/main"
          >
            More Examples →
          </Link>
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
    @apply border-b border-gray-200 py-5 relative z-20 bg-white;
    box-shadow: 0 0 15px 0 rgb(0 0 0 / 10%);
  }

  .container {
    @apply mx-auto max-w-7xl px-14;
  }

  .link {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    color: var(--accents-6);
    -webkit-text-decoration: none;
    text-decoration: none;
    -webkit-transition: color 0.2s ease;
    transition: color 0.2s ease;
  }

  .link:hover {
    color: var(--accents-8);
    cursor: pointer;
  }
</style>

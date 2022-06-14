<script>
  import clsx from 'clsx'
  const componentsMap = {
    h1: 'h1',
    h2: 'h2',
    body: 'p',
    description: 'p',
    smallText: 'small',
  }

  export let variant = 'body'
  export let className = ''
</script>

{#if variant === 'h1'}
  <h1 class={clsx(className, 'h1')}>
    <slot />
  </h1>
{/if}

{#if variant === 'h2'}
  <h2 class={clsx(className, 'h2')}>
    <slot />
  </h2>
{/if}

{#if variant === 'body'}
  <p class={clsx(className, 'body')}>
    <slot />
  </p>
{/if}

{#if variant === 'description'}
  <p class={clsx(className, 'description')}>
    <slot />
  </p>
{/if}

{#if variant === 'smallText'}
  <small class={clsx(className, 'smallText')}>
    <slot />
  </small>
{/if}

<style>
  .description {
    font-weight: 400;
    line-height: 1.6;
    letter-spacing: -0.02em;
    color: var(--accents-5);
    @apply text-base;
  }

  .body {
    font-weight: 400;
    line-height: 24px;
    line-height: 1.6;
    @apply text-base;
  }

  .h1 {
    font-size: 2.625rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1;
  }

  .h2 {
    font-weight: 600;
    letter-spacing: -0.47px;
    line-height: 32px;
    @apply text-3xl;
  }

  .description {
    font-weight: 500;
    line-height: 1.6;
    letter-spacing: -0.02em;
    color: var(--accents-5);
    @apply text-lg;
  }

  .smallText {
    letter-spacing: 0.1rem;
    margin-top: 0;
    padding-left: 0.2rem;
    @apply uppercase text-blue-500 font-semibold text-sm block mb-4;
  }
</style>

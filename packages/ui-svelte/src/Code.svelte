<script>
  import clsx from 'clsx'
  export let className = ''
</script>

<code class={clsx('root', className)}>
  <slot />
</code>

<style>
  .root {
    color: var(--geist-code);
    font-size: 16px;
    white-space: pre-wrap;
  }

  .root::before,
  .root::after {
    content: '`';
  }
</style>

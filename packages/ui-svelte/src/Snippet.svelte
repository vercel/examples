<script>
  import clsx from 'clsx'
  export let className = ''
</script>

<pre>
    <code class={clsx('root', className)}>
        <slot />
    </code>
</pre>

<style>
  .root {
    border-color: var(--accents-2);
    border-width: 1px;
    border-radius: 0.375rem;
    background-color: var(--accents-1);
    overflow-x: auto;
    padding: 1.5rem;
  }
</style>

<script>
  import clsx from 'clsx'
  export let href
  export let className = ''
</script>

<a class={clsx(className, 'root')} {href}>
  <slot />
</a>

<style>
  .root {
    color: var(--geist-link-color);
    text-decoration: none;
    transition: color 0.2s ease 0s;
  }

  .root:hover {
    color: var(--geist-link-color-light);
  }
</style>

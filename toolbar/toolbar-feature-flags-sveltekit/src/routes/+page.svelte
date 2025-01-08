<script lang="ts">
  let { data } = $props()
</script>

<h1 class:svelte={data.svelteColor}>SvelteKit + Vercel Feature Flags</h1>

<p>
  SvelteKit offers seamless integration with the <a
    target="_blank"
    rel="noreferrer"
    href="https://vercel.com/docs/workflow-collaboration/vercel-toolbar"
    >Vercel Toolbar</a
  >
  and
  <a
    target="_blank"
    rel="noreferrer"
    href="https://vercel.com/docs/workflow-collaboration/feature-flags"
    >Feature Flags</a
  >.
</p>
<p>
  This page's headline can take a different color depending on the value of a
  feature flag.
</p>
<div data-sveltekit-reload>
  <a class="normal-link" href="/">Change headline to normal</a>
  <a class="svelte-link" href="/?svelteColor">Change headline to orange-red</a>
</div>
<p>
  For demo purposes the feature flag depends on a URL query parameter, so you
  can toggle it from the browser. When you clone the example and link it to a
  project on Vercel, you can use the Vercel toolbar to override the feature flag
  value.
</p>

<style>
  h1 {
    font-size: min(16vw, 3rem);
    font-weight: 600;
    box-sizing: border-box;
  }

  a {
    color: var(--fg);
  }

  .normal-link,
  .svelte-link,
  .normal-link:visited,
  .svelte-link:visited {
    text-decoration: none;
    width: 15rem;
    display: inline-block;
    color: var(--fg);
    border: 1px solid var(--fg);
    border-radius: 0.5rem;
    padding: 1rem 2rem;
    text-align: center;
  }

  .svelte-link,
  .svelte-link:visited {
    color: var(--svelte);
    border-color: var(--svelte);
    margin-left: 1rem;
  }

  a:hover {
    text-decoration: underline;
  }

  .svelte {
    color: var(--svelte);
  }

  @media (min-width: 640px) {
    h1 {
      font-size: min(8vw, 3rem);
    }
  }
</style>

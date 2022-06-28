<script context="module">
  // disable client-side router to let requests be intercepted by Middleware
  export const router = false
</script>

<h1 class="h1">Vercel Middleware + Sveltekit</h1>

<p>You can access this page</p>
<p>
  Going to this <a href="/blocked">page</a> should block you and redirect here by
  Middleware
</p>

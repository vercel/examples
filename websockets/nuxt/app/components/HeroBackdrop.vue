<script setup lang="ts">
/**
 * Subtle animated glow behind the hero. Pure CSS — two slowly drifting green
 * radial gradients masked to fade downward. No dependencies, and it respects
 * `prefers-reduced-motion`. Swap this for a WebGL shader if you want more.
 */
</script>

<template>
  <div class="hero-backdrop pointer-events-none absolute inset-x-0 top-0 h-100 overflow-hidden">
    <div class="hero-backdrop__layer hero-backdrop__layer--a" />
    <div class="hero-backdrop__layer hero-backdrop__layer--b" />
  </div>
</template>

<style scoped>
.hero-backdrop {
  mask-image: linear-gradient(to bottom, black 55%, transparent);
}

.hero-backdrop__layer {
  position: absolute;
  inset: -20% -10% auto -10%;
  height: 130%;
  filter: blur(40px);
  will-change: transform, opacity;
}

.hero-backdrop__layer--a {
  background: radial-gradient(40% 55% at 35% 20%,
      color-mix(in oklab, var(--color-green-500) 30%, transparent),
      transparent 70%);
  animation: drift-a 14s ease-in-out infinite alternate;
}

.hero-backdrop__layer--b {
  background: radial-gradient(45% 50% at 70% 10%,
      color-mix(in oklab, var(--color-green-400) 22%, transparent),
      transparent 72%);
  animation: drift-b 18s ease-in-out infinite alternate;
}

@keyframes drift-a {
  from {
    transform: translate3d(-6%, 0, 0) scale(1);
    opacity: 0.7;
  }

  to {
    transform: translate3d(8%, 2%, 0) scale(1.15);
    opacity: 1;
  }
}

@keyframes drift-b {
  from {
    transform: translate3d(5%, 1%, 0) scale(1.1);
    opacity: 0.6;
  }

  to {
    transform: translate3d(-7%, -2%, 0) scale(1);
    opacity: 0.9;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-backdrop__layer {
    animation: none;
  }
}
</style>
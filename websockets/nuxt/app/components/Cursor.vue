<script setup lang="ts">
import type { RemotePeer } from '~/composables/useRealtime'

defineProps<{ peer: RemotePeer }>()
</script>

<template>
  <div class="cursor pointer-events-none absolute top-0 left-0 z-20 will-change-transform" :style="{ left: `${peer.x * 100}%`, top: `${peer.y * 100}%` }">
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" class="drop-shadow-sm">
      <path d="M3 2.5L16.5 11.5L10.2 12.6L13.4 18.8L10.6 20.2L7.4 13.9L3 17.5L3 2.5Z" :fill="peer.color" stroke="white" stroke-width="1.2" stroke-linejoin="round" />
    </svg>

    <span
      class="absolute top-5 left-4 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap text-white shadow-sm"
      :style="{ backgroundColor: peer.color }"
    >
      {{ peer.name }}
    </span>
  </div>
</template>

<style scoped>
.cursor {
  transition: left 90ms linear, top 90ms linear;
}
</style>
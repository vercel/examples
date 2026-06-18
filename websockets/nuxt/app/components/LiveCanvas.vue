<script setup lang="ts">
import { REACTIONS, type Reaction } from '#shared/types/realtime'
import type { UseRealtime } from '~/composables/useRealtime'

const props = defineProps<{ rt: UseRealtime }>()

const root = useTemplateRef('root')

// The armed emoji — click the grid to drop it.
const selected = ref<Reaction>(REACTIONS[0])

function toNormalized(event: MouseEvent) {
  const el = root.value
  if (!el) return null
  const rect = el.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  return { x: Math.min(Math.max(x, 0), 1), y: Math.min(Math.max(y, 0), 1) }
}

function onPointerMove(event: PointerEvent) {
  const pos = toNormalized(event)
  if (pos) props.rt.moveCursor(pos.x, pos.y)
}

// Drop the selected emoji wherever you click on the canvas.
function onCanvasClick(event: MouseEvent) {
  const pos = toNormalized(event)
  if (pos) props.rt.sendReaction(selected.value, pos.x, pos.y)
}
</script>

<template>
  <div ref="root" class="dot-grid relative h-[50vh] min-h-100 w-full overflow-hidden rounded-lg border border-default bg-elevated/30" @pointermove="onPointerMove" @click="onCanvasClick">
    <!-- Empty state hint -->
    <Transition enter-active-class="transition-opacity duration-500" leave-active-class="transition-opacity duration-300" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="rt.others.value.length === 0" class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <UIcon name="i-lucide-mouse-pointer-2" class="size-8 text-dimmed" />
        <p class="max-w-xs text-sm text-muted">
          You're the only one here. Open this page in another tab or share the
          link to see live cursors.
        </p>
      </div>
    </Transition>

    <!-- Remote cursors -->
    <Cursor v-for="peer in rt.others.value" v-show="peer.active" :key="peer.id" :peer="peer" />

    <!-- Reaction bursts -->
    <div v-for="r in rt.reactions.value" :key="r.key" class="reaction pointer-events-none absolute z-30 -translate-x-1/2 text-2xl select-none" :style="{ left: `${r.x * 100}%`, top: `${r.y * 100}%` }">
      {{ r.emoji }}
    </div>

    <!-- Reaction picker: arm an emoji, then click the grid to drop it -->
    <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5" @click.stop>
      <span class="text-xs text-dimmed"
        >Pick an emoji, then click the grid to drop it</span>
      <div class="flex items-center gap-1 rounded-full border border-default bg-default/80 p-1 shadow-sm backdrop-blur">
        <UButton v-for="emoji in REACTIONS" :key="emoji" color="neutral" variant="ghost" class="size-8 justify-center rounded-full p-0 text-lg leading-none transition" :class="selected === emoji
          ? 'scale-110 bg-accented hover:bg-accented active:bg-accented'
          : 'hover:scale-110'
          " :aria-pressed="selected === emoji" @click="selected = emoji">
          {{ emoji }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reaction {
  animation: float-up 1.8s ease-out forwards;
}

/* Dotted grid backdrop for the live canvas. */
.dot-grid {
  background-image: radial-gradient(color-mix(in oklab, var(--ui-border) 90%, transparent) 1px,
      transparent 1px);
  background-size: 22px 22px;
}

@keyframes float-up {
  0% {
    opacity: 0;
    transform: translate(-50%, 0) scale(0.6);
  }

  15% {
    opacity: 1;
    transform: translate(-50%, -8px) scale(1.1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -90px) scale(1);
  }
}
</style>
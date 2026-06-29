<script setup lang="ts">
import type { Peer } from '#shared/types/realtime'
import type { UseRealtime } from '~/composables/useRealtime'

const props = defineProps<{ rt: UseRealtime }>()

const statusMeta = computed(
  () =>
  ({
    connecting: { color: 'bg-warning', label: 'Connecting' },
    connected: { color: 'bg-success', label: 'Live' },
    disconnected: { color: 'bg-error', label: 'Reconnecting' },
  }[props.rt.status.value])
)

// Self first (labelled "you"), then everyone else.
const everyone = computed<Array<Peer & { label: string }>>(() => {
  const self = props.rt.self.value
  return [
    ...(self ? [{ ...self, label: `${self.name} (you)` }] : []),
    ...props.rt.others.value.map((peer) => ({ ...peer, label: peer.name })),
  ]
})

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const avatarUi = { fallback: 'text-[11px] font-semibold text-white' }
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="flex items-center gap-2 rounded-full ring ring-default bg-default px-3 py-1.5">
      <span class="relative flex size-2">
        <span
          class="absolute inline-flex size-full animate-ping rounded-full opacity-60"
          :class="statusMeta.color"
        />
        <span
          class="relative inline-flex size-2 rounded-full"
          :class="statusMeta.color"
        />
      </span>
      <span class="text-xs font-medium text-muted">{{ statusMeta.label }}</span>
    </div>

    <UAvatarGroup :max="6" size="sm">
      <UTooltip v-for="peer in everyone" :key="peer.id" :text="peer.label">
        <UAvatar :text="initials(peer.name)" :style="{ backgroundColor: peer.color }" :ui="avatarUi" />
      </UTooltip>
    </UAvatarGroup>

    <span class="text-sm text-muted">
      <span class="font-semibold text-highlighted">{{ rt.count.value }}</span>
    {{ rt.count.value === 1 ? 'person' : 'people' }} here
    </span>
  </div>
</template>
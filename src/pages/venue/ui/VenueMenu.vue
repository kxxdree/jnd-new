<script setup lang="ts">
import type { Venue } from '@entities/venue'
import { formatPrice } from '@shared/lib'
import { UiIcon } from '@shared/ui'

defineProps<{ venue: Venue }>()
const tab = ref<'bar' | 'kitchen'>('bar')
</script>

<template>
  <div class="card p-6 sm:p-10">
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <h2 class="h-display text-4xl sm:text-5xl">Меню</h2>
      <div class="segmented">
        <button :aria-pressed="tab === 'bar'" @click="tab = 'bar'"><UiIcon name="glass" :size="16" /> Бар</button>
        <button :aria-pressed="tab === 'kitchen'" @click="tab = 'kitchen'"><UiIcon name="utensils" :size="16" /> Кухня</button>
      </div>
    </div>
    <div class="grid gap-x-12 md:grid-cols-2">
      <div v-for="item in venue.menu[tab]" :key="item.name" class="flex items-baseline gap-3 border-b border-line py-5">
        <div class="min-w-0">
          <p class="font-medium">{{ item.name }}</p>
          <p v-if="item.desc" class="mt-1 text-sm text-muted">{{ item.desc }}</p>
        </div>
        <span class="mx-1 flex-1 -translate-y-1 border-b border-dotted border-white/20" />
        <span class="shrink-0 font-medium text-sand">{{ formatPrice(item.price) }}</span>
      </div>
    </div>
  </div>
</template>

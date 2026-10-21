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
    <!-- Прайс-лист: название + описание мелким в строку, цена справа -->
    <ul>
      <li v-for="item in venue.menu[tab]" :key="item.name" class="flex items-baseline justify-between gap-6 border-b border-line py-3.5 last:border-b-0">
        <p class="min-w-0 text-base">
          {{ item.name }}
          <span v-if="item.desc" class="ml-2 text-xs text-muted">({{ item.desc }})</span>
        </p>
        <span class="shrink-0 text-base tabular-nums">{{ formatPrice(item.price) }}</span>
      </li>
    </ul>
  </div>
</template>

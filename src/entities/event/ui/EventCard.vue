<script setup lang="ts">
import { genreName } from '@shared/config'
import { dayNumber, formatPrice, formatWeekday, monthShort } from '@shared/lib'
import { UiPhoto } from '@shared/ui'
import { minPrice } from '../lib/event'
import type { EventItem } from '../model/types'

defineProps<{ event: EventItem; venueName?: string }>()
</script>

<template>
  <NuxtLink :to="`/events/${event.id}`" class="card card-hover group flex flex-col overflow-hidden p-2">
    <UiPhoto :src="event.photo" :alt="event.title" class="aspect-4/3 rounded-[1.25rem] sm:aspect-13/10">
      <div class="glass-chip absolute top-3 left-3 rounded-2xl px-3 py-2 text-center">
        <div class="text-xl leading-none font-semibold">{{ dayNumber(event.date) }}</div>
        <div class="mt-0.5 text-[11px] text-soft uppercase">{{ monthShort(event.date) }}</div>
      </div>
      <div class="absolute inset-0 transition-[backdrop-filter] duration-500 group-hover:backdrop-saturate-150" />
    </UiPhoto>
    <div class="flex flex-1 flex-col px-3 pt-4 pb-3">
      <div class="mb-3 flex flex-wrap gap-1.5">
        <span v-for="g in event.genres" :key="g" class="tag">{{ genreName(g) }}</span>
      </div>
      <h3 class="text-lg leading-snug font-medium transition-colors group-hover:text-sand">{{ event.title }}</h3>
      <p v-if="venueName" class="mt-1 text-sm text-soft">{{ venueName }}</p>
      <div class="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
        <span>{{ formatWeekday(event.date) }}, {{ event.time }}</span>
        <span class="glass-chip rounded-full px-3 py-1 text-white">от {{ formatPrice(minPrice(event)) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

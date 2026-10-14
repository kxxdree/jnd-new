<script setup lang="ts">
import type { EventItem } from '~/data/types'
import { genreName, getVenue, minPrice } from '~/data/catalog'

const props = defineProps<{ event: EventItem }>()
const venue = computed(() => getVenue(props.event.venue))
</script>

<template>
  <NuxtLink :to="`/events/${event.id}`" class="card group flex flex-col overflow-hidden">
    <PhotoImg :src="event.photo" :alt="event.title" class="aspect-4/3 rounded-card sm:aspect-13/10">
      <div class="absolute top-3 left-3 rounded-xl bg-black/70 px-3 py-2 text-center backdrop-blur">
        <div class="text-xl leading-none font-semibold">{{ dayNumber(event.date) }}</div>
        <div class="mt-0.5 text-[11px] text-soft uppercase">{{ monthShort(event.date) }}</div>
      </div>
      <div class="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
    </PhotoImg>
    <div class="flex flex-1 flex-col p-4 pt-4 sm:p-5">
      <div class="mb-3 flex flex-wrap gap-1.5">
        <span v-for="g in event.genres" :key="g" class="tag">{{ genreName(g) }}</span>
      </div>
      <h3 class="text-lg leading-snug font-medium transition-colors group-hover:text-accent-text">{{ event.title }}</h3>
      <p v-if="venue" class="mt-1 text-sm text-soft">{{ venue.name }}</p>
      <div class="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
        <span>{{ formatWeekday(event.date) }}, {{ event.time }}</span>
        <span class="text-white">от {{ formatPrice(minPrice(event)) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

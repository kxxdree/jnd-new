<script setup lang="ts">
import type { Venue } from '~/data/types'
import { formatName, genreName } from '~/data/catalog'

defineProps<{ venue: Venue; active?: boolean; compact?: boolean }>()
const { has, toggle } = useFavorites()
</script>

<template>
  <NuxtLink
    :to="`/venues/${venue.slug}`"
    class="card group flex overflow-hidden transition-shadow"
    :class="[compact ? 'flex-row' : 'flex-col', active ? 'ring-2 ring-accent' : '']"
  >
    <PhotoImg
      :src="venue.photo"
      :alt="venue.name"
      :class="compact ? 'w-32 shrink-0 rounded-card sm:w-44' : 'aspect-4/3 rounded-card sm:aspect-13/10'"
    >
      <button
        v-if="!compact"
        class="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-black/60 backdrop-blur transition-colors hover:bg-black/80"
        :class="has('venues', venue.slug) ? 'text-accent' : 'text-white'"
        :aria-label="has('venues', venue.slug) ? 'Убрать из избранного' : 'В избранное'"
        @click.prevent.stop="toggle('venues', venue.slug)"
      >
        <AppIcon name="heart" :filled="has('venues', venue.slug)" :size="18" />
      </button>
    </PhotoImg>
    <div class="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
      <div class="mb-3 flex flex-wrap gap-1.5">
        <span class="tag">{{ formatName(venue.format) }}</span>
        <span v-for="g in venue.genres.slice(0, compact ? 1 : 2)" :key="g" class="tag border-line bg-card-2 text-soft">{{ genreName(g) }}</span>
      </div>
      <h3 class="text-lg leading-snug font-medium transition-colors group-hover:text-accent-text">{{ venue.name }}</h3>
      <p class="mt-1 line-clamp-2 text-sm text-soft">{{ venue.short }}</p>
      <div class="mt-auto flex items-center gap-3 pt-4 text-xs text-muted">
        <span class="inline-flex items-center gap-1 text-white">
          <AppIcon name="star" filled :size="14" class="text-accent" /> {{ venue.rating }}
        </span>
        <span class="truncate">{{ venue.metro ? `м. ${venue.metro}` : venue.address }}</span>
        <span class="ml-auto shrink-0">~{{ formatPrice(venue.avgCheck) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

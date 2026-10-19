<script setup lang="ts">
import { genreName } from '@shared/config'
import { formatPrice } from '@shared/lib'
import { UiIcon, UiPhoto } from '@shared/ui'
import { formatName } from '../model/dictionaries'
import type { Venue } from '../model/types'

/** Слот actions - для кнопок фич (например, «в избранное») поверх фото */
defineProps<{ venue: Venue; active?: boolean }>()
</script>

<template>
  <NuxtLink
    :to="`/venues/${venue.slug}`"
    class="card card-hover group flex flex-col overflow-hidden p-2"
    :class="active ? 'shadow-[0_0_0_2px_rgb(255_122_51/0.9),0_20px_50px_-15px_rgb(255_77_0/0.6)]' : ''"
  >
    <UiPhoto :src="venue.photo" :alt="venue.name" class="aspect-4/3 rounded-[1.25rem] sm:aspect-13/10">
      <div class="absolute top-3 right-3"><slot name="actions" /></div>
      <div class="glass-chip absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium">
        <UiIcon name="star" filled :size="14" class="text-sand" /> {{ venue.rating }}
      </div>
    </UiPhoto>
    <div class="flex min-w-0 flex-1 flex-col px-3 pt-4 pb-3">
      <div class="mb-3 flex flex-wrap gap-1.5">
        <span class="tag">{{ formatName(venue.format) }}</span>
        <span v-for="g in venue.genres.slice(0, 2)" :key="g" class="tag tag-neutral">{{ genreName(g) }}</span>
      </div>
      <h3 class="text-lg leading-snug font-medium transition-colors group-hover:text-sand">{{ venue.name }}</h3>
      <p class="mt-1 line-clamp-2 text-sm text-soft">{{ venue.short }}</p>
      <div class="mt-auto flex items-center gap-3 pt-4 text-xs text-muted">
        <UiIcon name="pin" :size="14" />
        <span class="truncate">{{ venue.metro ? `м. ${venue.metro}` : venue.address }}</span>
        <span class="ml-auto shrink-0">~{{ formatPrice(venue.avgCheck) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

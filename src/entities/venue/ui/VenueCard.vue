<script setup lang="ts">
import { genreName } from '@shared/config'
import { UiIcon, UiPhoto } from '@shared/ui'
import { formatName } from '../model/dictionaries'
import type { Venue } from '../model/types'

/** Слот actions - для кнопок фич (например, «в избранное») поверх фото; square - прямые углы */
defineProps<{ venue: Venue; active?: boolean; square?: boolean }>()
</script>

<template>
  <NuxtLink
    :to="`/venues/${venue.slug}`"
    class="card card-hover group flex flex-col overflow-hidden p-2"
    :class="[active && 'shadow-[0_0_0_1.5px_rgb(255_200_160/0.85),0_24px_50px_-15px_rgb(0_0_0/0.9)]', square && 'rounded-none']"
  >
    <UiPhoto :src="venue.photo" :alt="venue.name" class="aspect-4/3 sm:aspect-13/10" :class="square ? 'rounded-none' : 'rounded-[1.25rem]'">
      <div class="absolute top-3 right-3"><slot name="actions" /></div>
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
      </div>
    </div>
  </NuxtLink>
</template>

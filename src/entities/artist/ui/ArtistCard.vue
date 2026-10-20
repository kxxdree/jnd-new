<script setup lang="ts">
import { genreName } from '@shared/config'
import { UiPhoto } from '@shared/ui'
import type { Artist } from '../model/types'

defineProps<{ artist: Artist; cityLabel?: string }>()
</script>

<template>
  <!-- Карточка-постер, как у событий: фото с крупным именем + плашка с городом и жанрами -->
  <NuxtLink :to="`/artists/${artist.slug}`" class="card card-hover group flex flex-col overflow-hidden rounded-none">
    <UiPhoto :src="artist.photo" :alt="artist.name" class="aspect-square">
      <div class="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />
      <h3 class="absolute inset-x-0 bottom-0 line-clamp-3 p-3 font-display text-lg leading-[0.95] font-semibold tracking-[-0.02em] wrap-break-word hyphens-auto uppercase sm:p-4 sm:text-xl lg:p-5 lg:text-[1.65rem]" lang="ru">
        {{ artist.name }}
      </h3>
    </UiPhoto>

    <div class="flex flex-1 flex-col justify-end p-3 sm:p-4 lg:p-5">
      <div class="grid min-w-0 gap-0.5 text-[11px] leading-tight font-semibold tracking-wider uppercase">
        <span v-if="cityLabel" class="truncate text-soft">{{ cityLabel }}</span>
        <span class="mt-2 flex flex-wrap gap-x-2">
          <span v-for="g in artist.genres.slice(0, 2)" :key="g">{{ genreName(g) }}</span>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { genreName } from '@shared/config'
import { UiPhoto } from '@shared/ui'
import type { Artist } from '../model/types'

defineProps<{ artist: Artist; cityLabel?: string }>()
</script>

<template>
  <NuxtLink :to="`/artists/${artist.slug}`" class="card card-hover group block overflow-hidden p-2">
    <UiPhoto :src="artist.photo" :alt="artist.name" class="aspect-square rounded-[1.25rem]">
      <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3 pt-16">
        <div class="flex flex-wrap gap-1.5">
          <span v-for="g in artist.genres.slice(0, 2)" :key="g" class="tag">{{ genreName(g) }}</span>
        </div>
      </div>
    </UiPhoto>
    <div class="px-3 pt-3 pb-2">
      <h3 class="text-lg font-medium transition-colors group-hover:text-sand">{{ artist.name }}</h3>
      <p v-if="cityLabel" class="text-sm text-muted">{{ cityLabel }}</p>
    </div>
  </NuxtLink>
</template>

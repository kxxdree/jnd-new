<script setup lang="ts">
import type { Artist } from '~/data/types'
import { cityName, genreName } from '~/data/catalog'

defineProps<{ artist: Artist }>()
</script>

<template>
  <NuxtLink :to="`/artists/${artist.slug}`" class="group block">
    <PhotoImg :src="artist.photo" :alt="artist.name" class="aspect-square rounded-card">
      <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4 pt-16">
        <div class="flex flex-wrap gap-1.5">
          <span v-for="g in artist.genres.slice(0, 2)" :key="g" class="tag">{{ genreName(g) }}</span>
        </div>
      </div>
    </PhotoImg>
    <h3 class="mt-3 text-lg font-medium transition-colors group-hover:text-accent-text">{{ artist.name }}</h3>
    <p class="text-sm text-muted">{{ cityName(artist.city) }} · {{ compact(artist.followers) }} подписчиков</p>
  </NuxtLink>
</template>

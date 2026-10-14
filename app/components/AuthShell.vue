<script setup lang="ts">
import { ph } from '~/data/catalog'

defineProps<{ title: string; subtitle: string }>()
</script>

<template>
  <section class="container-x grid gap-3 py-8 lg:min-h-[calc(100vh-72px)] lg:grid-cols-2 lg:py-10">
    <PhotoImg :src="ph('concert,crowd', 77, 1200, 1400)" class="hidden rounded-4xl lg:block">
      <div class="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
      <p class="h-display absolute bottom-10 left-10 right-10 text-6xl">Музыка лучше,<br>когда вы вместе.</p>
    </PhotoImg>
    <div class="flex items-center justify-center">
      <div class="w-full max-w-md py-6">
        <h1 class="h-display text-5xl sm:text-6xl">{{ title }}</h1>
        <p class="mt-3 mb-8 text-soft">{{ subtitle }}</p>
        <slot />
      </div>
    </div>
  </section>
</template>

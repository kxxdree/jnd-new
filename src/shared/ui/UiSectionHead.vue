<script setup lang="ts">
import UiIcon from './UiIcon.vue'

defineProps<{ title: string; subtitle?: string; to?: string; linkLabel?: string; eyebrow?: string }>()
</script>

<template>
  <div class="mb-8 flex items-end justify-between gap-4">
    <div>
      <p v-if="eyebrow" class="mb-3 text-xs font-medium tracking-[0.2em] text-accent-text uppercase">{{ eyebrow }}</p>
      <h2 class="h-display text-3xl sm:text-5xl">{{ title }}</h2>
      <p v-if="subtitle" class="mt-3 text-soft">{{ subtitle }}</p>
    </div>
    <NuxtLink v-if="to" :to="to" class="btn-dark hidden shrink-0 sm:inline-flex">
      {{ linkLabel ?? 'Смотреть все' }} <UiIcon name="arrow-right" :size="16" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; to?: string; linkLabel?: string }>()
</script>

<template>
  <div class="mb-8 flex items-end justify-between gap-4">
    <div>
      <h2 class="h-display text-3xl sm:text-5xl">{{ title }}</h2>
      <p v-if="subtitle" class="mt-3 text-soft">{{ subtitle }}</p>
    </div>
    <NuxtLink v-if="to" :to="to" class="hidden shrink-0 items-center gap-1.5 text-sm text-soft hover:text-white sm:inline-flex">
      {{ linkLabel ?? 'Смотреть все' }} <AppIcon name="arrow-right" :size="16" />
    </NuxtLink>
  </div>
</template>

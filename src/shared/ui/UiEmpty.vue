<script setup lang="ts">
import UiIcon from './UiIcon.vue'

defineProps<{ icon?: string; title: string; text?: string }>()
</script>

<template>
  <div class="card flex flex-col items-center px-6 py-14 text-center">
    <div class="glass-chip mb-4 grid size-14 place-items-center rounded-full text-accent-text">
      <UiIcon :name="icon ?? 'search'" :size="24" />
    </div>
    <h3 class="text-lg font-medium">{{ title }}</h3>
    <p v-if="text" class="mt-1 max-w-sm text-sm text-muted">{{ text }}</p>
    <div class="mt-5 empty:hidden"><slot /></div>
  </div>
</template>

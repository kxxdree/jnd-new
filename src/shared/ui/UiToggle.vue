<script setup lang="ts">
defineProps<{ label: string; hint?: string }>()
const model = defineModel<boolean>({ required: true })
</script>

<template>
  <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
    <span>
      <span class="block font-medium">{{ label }}</span>
      <span v-if="hint" class="mt-0.5 block text-sm text-muted">{{ hint }}</span>
    </span>
    <!-- плоский переключатель: серая плашка + бегунок, без теней -->
    <span
      class="relative inline-flex h-8 w-[3.25rem] shrink-0 items-center rounded-lg transition-colors duration-300"
      :class="model ? 'bg-accent' : 'bg-white/10'"
    >
      <input v-model="model" type="checkbox" class="peer sr-only">
      <span
        class="absolute left-1 h-6 w-6 rounded-md bg-white transition-all duration-300 ease-[var(--ease-liquid)] peer-active:w-8 peer-focus-visible:ring-2 peer-focus-visible:ring-white"
        :class="model ? 'translate-x-5 peer-active:translate-x-3' : ''"
      />
    </span>
  </label>
</template>

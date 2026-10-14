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
    <span class="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors" :class="model ? 'bg-accent' : 'bg-[#2e2e2e]'">
      <input v-model="model" type="checkbox" class="peer sr-only">
      <span class="absolute left-1 size-5 rounded-full bg-white transition-transform peer-focus-visible:ring-2 peer-focus-visible:ring-white" :class="model ? 'translate-x-5' : ''" />
    </span>
  </label>
</template>

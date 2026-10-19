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
    <!-- «жидкий» переключатель в стиле iOS -->
    <span
      class="relative inline-flex h-8 w-[3.25rem] shrink-0 items-center rounded-full transition-[background,box-shadow] duration-300"
      :class="model
        ? 'bg-linear-to-b from-[#ff7a33] to-[#ff4d00] shadow-[inset_0_1px_0_rgb(255_255_255/0.45),0_6px_16px_-6px_rgb(255_77_0/0.8)]'
        : 'bg-black/30 shadow-[inset_0_1px_3px_rgb(0_0_0/0.5),inset_0_0_0_1px_rgb(255_255_255/0.1)]'"
    >
      <input v-model="model" type="checkbox" class="peer sr-only">
      <span
        class="absolute left-1 h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.35),inset_0_-1px_2px_rgb(0_0_0/0.15)] transition-all duration-300 ease-[var(--ease-liquid)] peer-active:w-8 peer-focus-visible:ring-2 peer-focus-visible:ring-white"
        :class="model ? 'translate-x-5 peer-active:translate-x-3' : ''"
      />
    </span>
  </label>
</template>

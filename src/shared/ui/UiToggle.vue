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
        ? '[background:var(--accent-fill)] [box-shadow:var(--accent-shadow)]'
        : 'bg-black/35 shadow-[inset_0_1px_3px_rgb(0_0_0/0.55),inset_0_0_0_1px_rgb(255_255_255/0.06)]'"
    >
      <input v-model="model" type="checkbox" class="peer sr-only">
      <span
        class="absolute left-1 h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.35),inset_0_-1px_2px_rgb(0_0_0/0.15)] transition-all duration-300 ease-[var(--ease-liquid)] peer-active:w-8 peer-focus-visible:ring-2 peer-focus-visible:ring-white"
        :class="model ? 'translate-x-5 peer-active:translate-x-3' : ''"
      />
    </span>
  </label>
</template>

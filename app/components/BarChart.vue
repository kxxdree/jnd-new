<script setup lang="ts">
/** Простой столбчатый график: одна серия, подписи по оси X, значение — в подсказке */
const props = withDefaults(defineProps<{ data: { label: string; value: number }[]; height?: number; unit?: string }>(), {
  height: 180,
  unit: '',
})
const max = computed(() => Math.max(...props.data.map(d => d.value), 1))
</script>

<template>
  <div>
    <div class="flex items-end gap-1.5 sm:gap-2" :style="{ height: `${height}px` }">
      <div v-for="d in data" :key="d.label" class="group relative flex h-full flex-1 flex-col justify-end">
        <span class="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-white px-1.5 py-0.5 text-xs whitespace-nowrap text-black opacity-0 transition-opacity group-hover:opacity-100">
          {{ d.value.toLocaleString('ru-RU') }}{{ unit }}
        </span>
        <div
          class="w-full rounded-t-md bg-accent/80 transition-colors group-hover:bg-accent"
          :style="{ height: `${Math.max((d.value / max) * 100, 2)}%` }"
        />
      </div>
    </div>
    <div class="mt-2 flex gap-1.5 sm:gap-2">
      <span v-for="d in data" :key="d.label" class="flex-1 truncate text-center text-[11px] text-muted">{{ d.label }}</span>
    </div>
  </div>
</template>

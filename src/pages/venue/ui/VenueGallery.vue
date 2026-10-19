<script setup lang="ts">
import { UiIcon, UiModal, UiPhoto } from '@shared/ui'

const props = defineProps<{ photos: string[] }>()

const current = ref<number | null>(null)
const open = computed({ get: () => current.value !== null, set: (v) => { if (!v) current.value = null } })
const step = (d: number) => {
  if (current.value !== null) current.value = Math.min(Math.max(current.value + d, 0), props.photos.length - 1)
}
</script>

<template>
  <div>
    <h2 class="h-display mb-8 text-4xl sm:text-5xl">Интерьер и события</h2>
    <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
      <button
        v-for="(src, i) in photos"
        :key="src"
        class="card group overflow-hidden p-1.5"
        :class="i === 0 ? 'col-span-2 row-span-2' : ''"
        @click="current = i"
      >
        <UiPhoto :src="src" class="aspect-square rounded-[1.3rem] transition-transform duration-700 ease-[var(--ease-liquid)] group-hover:scale-[1.03]" />
      </button>
    </div>
    <UiModal v-model="open" :title="`${(current ?? 0) + 1} / ${photos.length}`" wide>
      <UiPhoto v-if="current !== null" :src="photos[current]!" class="aspect-4/3 rounded-3xl" />
      <div class="mt-4 flex justify-between">
        <button class="btn-dark" :disabled="!current" @click="step(-1)"><UiIcon name="chevron-left" :size="16" /> Назад</button>
        <button class="btn-dark" :disabled="current === photos.length - 1" @click="step(1)">Вперёд <UiIcon name="chevron-right" :size="16" /></button>
      </div>
    </UiModal>
  </div>
</template>

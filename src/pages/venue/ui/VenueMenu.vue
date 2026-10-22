<script setup lang="ts">
import type { Venue } from '@entities/venue'
import { UiEmpty, UiIcon, UiModal, UiPhoto } from '@shared/ui'

const props = defineProps<{ venue: Venue }>()
const tab = ref<'bar' | 'kitchen'>('bar')
const photos = computed(() => props.venue.menu[tab.value])

// Просмотр страницы меню крупно, с листанием - как в галерее
const current = ref<number | null>(null)
const open = computed({ get: () => current.value !== null, set: (v) => { if (!v) current.value = null } })
const step = (d: number) => {
  if (current.value !== null) current.value = Math.min(Math.max(current.value + d, 0), photos.value.length - 1)
}
</script>

<template>
  <div class="card p-6 sm:p-10">
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <h2 class="h-display text-4xl sm:text-5xl">Меню</h2>
      <div class="segmented">
        <button :aria-pressed="tab === 'bar'" @click="tab = 'bar'"><UiIcon name="glass" :size="16" /> Бар</button>
        <button :aria-pressed="tab === 'kitchen'" @click="tab = 'kitchen'"><UiIcon name="utensils" :size="16" /> Кухня</button>
      </div>
    </div>
    <!-- Страницы меню - фото, загруженные заведением -->
    <div v-if="photos.length" class="grid grid-cols-2 gap-3 md:grid-cols-3">
      <button
        v-for="(src, i) in photos"
        :key="src"
        class="group overflow-hidden rounded-2xl"
        :aria-label="`Открыть страницу меню ${i + 1}`"
        @click="current = i"
      >
        <UiPhoto :src="src" :alt="`Меню, страница ${i + 1}`" class="aspect-3/4 transition-transform duration-700 ease-liquid group-hover:scale-[1.03]" />
      </button>
    </div>
    <UiEmpty v-else icon="utensils" title="Меню пока не загружено" :text="`Заведение ещё не добавило меню ${tab === 'bar' ? 'бара' : 'кухни'}`" />

    <UiModal v-model="open" :title="`${tab === 'bar' ? 'Бар' : 'Кухня'} · ${(current ?? 0) + 1} / ${photos.length}`" wide>
      <!-- целиком, без обрезки: фото меню бывают любых пропорций -->
      <img v-if="current !== null" :src="photos[current]!" :alt="`Меню, страница ${current + 1}`" class="mx-auto max-h-[70vh] w-auto rounded-3xl object-contain">

      <div class="mt-4 flex justify-between">
        <button class="btn-icon" :disabled="!current" aria-label="Предыдущая страница" @click="step(-1)"><UiIcon name="chevron-left" :size="20" /></button>
        <button class="btn-icon" :disabled="current === photos.length - 1" aria-label="Следующая страница" @click="step(1)"><UiIcon name="chevron-right" :size="20" /></button>
      </div>
    </UiModal>
  </div>
</template>

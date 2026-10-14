<script setup lang="ts">
import type { GenreId } from '~/data/types'
import { artists, cities, genres } from '~/data/catalog'

useHead({ title: 'Артисты и группы — Joined' })

const genre = ref<GenreId | ''>('')
const city = ref('')
const q = ref('')

const list = computed(() =>
  artists
    .filter(a => !genre.value || a.genres.includes(genre.value))
    .filter(a => !city.value || a.city === city.value)
    .filter(a => !q.value.trim() || a.name.toLowerCase().includes(q.value.trim().toLowerCase()))
    .sort((a, b) => b.followers - a.followers),
)
</script>

<template>
  <div>
    <section class="container-x pt-10 pb-10 text-center sm:pt-16">
      <h1 class="h-display text-[15vw] sm:text-8xl lg:text-[8.5rem]">Артисты</h1>
      <p class="mt-4 text-soft">Группы, коллективы и музыканты, которые играют в барах страны</p>

      <div class="mx-auto mt-8 flex max-w-xl flex-col gap-2 sm:flex-row">
        <label class="flex flex-1 items-center gap-3 rounded-xl bg-card-2 px-4">
          <AppIcon name="search" class="text-muted" :size="18" />
          <input v-model="q" type="search" placeholder="Название группы" class="w-full bg-transparent py-2.5 text-sm placeholder:text-muted" aria-label="Поиск артистов">
        </label>
        <select v-model="city" class="field appearance-none sm:w-52" aria-label="Город">
          <option value="">Все города</option>
          <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
      <div class="mt-6"><FilterPills v-model="genre" :options="genres" center /></div>
    </section>

    <section class="container-x">
      <div v-if="list.length" class="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        <ArtistCard v-for="a in list" :key="a.slug" :artist="a" />
      </div>
      <EmptyState v-else icon="music" title="Никого не нашли" text="Попробуйте другой жанр или город." />
    </section>
  </div>
</template>

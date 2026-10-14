<script setup lang="ts">
import type { GenreId } from '~/data/types'
import { artists, events, genres, isUpcoming, venues } from '~/data/catalog'

useHead({ title: 'Joined — бары и живая музыка в твоём городе' })

const { cityId, city } = useCity()
const genre = ref<GenreId | ''>('')
const query = ref('')

const cityVenues = computed(() => venues.filter(v => v.city === cityId.value))
const cityVenueSlugs = computed(() => new Set(cityVenues.value.map(v => v.slug)))

const upcoming = computed(() =>
  events
    .filter(e => isUpcoming(e) && cityVenueSlugs.value.has(e.venue))
    .filter(e => !genre.value || e.genres.includes(genre.value))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6),
)

const popularVenues = computed(() =>
  [...cityVenues.value]
    .filter(v => !genre.value || v.genres.includes(genre.value))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3),
)

const topArtists = computed(() => [...artists].sort((a, b) => b.followers - a.followers).slice(0, 4))

const search = () => navigateTo({ path: '/venues', query: { q: query.value || undefined, genre: genre.value || undefined } })

const stats = computed(() => [
  { value: venues.length * 37, label: 'баров и площадок' },
  { value: events.length * 61, label: 'событий в месяц' },
  { value: artists.length * 54, label: 'музыкантов и групп' },
])
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="container-x pt-12 pb-16 text-center sm:pt-20 sm:pb-24">
      <div class="mb-8 flex justify-center">
        <CitySelect />
      </div>
      <h1 class="h-display text-[15vw] sm:text-8xl lg:text-[8.5rem]">
        Найди свой<br><span class="text-accent">звук</span> сегодня
      </h1>
      <p class="mx-auto mt-6 max-w-xl text-base text-soft sm:text-lg">
        Бары, концерты и джем-сейшены {{ city.where }} — по жанрам, с расписанием выступлений и билетами в пару кликов.
      </p>

      <form class="mx-auto mt-10 flex max-w-xl gap-2 rounded-2xl bg-card p-2" role="search" @submit.prevent="search">
        <label class="flex flex-1 items-center gap-3 px-3">
          <AppIcon name="search" class="text-muted" />
          <input v-model="query" type="search" placeholder="Бар, артист или жанр" class="w-full bg-transparent py-2 text-sm placeholder:text-muted" aria-label="Поиск">
        </label>
        <button class="btn-primary px-5" type="submit">Найти</button>
      </form>

      <div class="mt-8">
        <FilterPills v-model="genre" :options="genres" center />
      </div>
    </section>

    <!-- БЛИЖАЙШИЕ СОБЫТИЯ -->
    <section class="container-x">
      <SectionHead title="Ближайшие события" to="/events" link-label="Вся афиша" />
      <div v-if="upcoming.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <EventCard v-for="e in upcoming" :key="e.id" :event="e" />
      </div>
      <EmptyState v-else icon="calendar" title="Пока нет событий" text="Попробуйте другой жанр или город — афиша обновляется каждый день." />
      <NuxtLink to="/events" class="btn-dark mt-4 w-full sm:hidden">Вся афиша</NuxtLink>
    </section>

    <!-- СТАТИСТИКА -->
    <section class="container-x mt-24">
      <div class="grid grid-cols-3 gap-3">
        <div v-for="s in stats" :key="s.label" class="card p-4 sm:p-8">
          <div class="h-display text-3xl sm:text-6xl">{{ s.value }}+</div>
          <div class="mt-2 text-xs text-muted sm:text-sm">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- ПОПУЛЯРНЫЕ БАРЫ -->
    <section class="container-x mt-24">
      <SectionHead title="Популярные бары" :subtitle="`Лучшие места по оценкам гостей · ${city.name}`" to="/venues" link-label="Все заведения" />
      <div v-if="popularVenues.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <VenueCard v-for="v in popularVenues" :key="v.slug" :venue="v" />
      </div>
      <EmptyState v-else icon="glass" title="Ничего не нашлось" text="В этом городе пока нет заведений с выбранным жанром." />
    </section>

    <!-- АРТИСТЫ -->
    <section class="container-x mt-24">
      <SectionHead title="Артисты" subtitle="Подписывайтесь и узнавайте о концертах первыми" to="/artists" link-label="Все артисты" />
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ArtistCard v-for="a in topArtists" :key="a.slug" :artist="a" />
      </div>
    </section>

    <!-- ПАРТНЁРАМ -->
    <section class="container-x mt-24">
      <div class="relative overflow-hidden rounded-4xl bg-accent p-8 sm:p-14">
        <div class="pointer-events-none absolute -right-20 -bottom-24 size-80 rounded-full bg-sand/40 blur-3xl" />
        <div class="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <h2 class="h-display text-4xl sm:text-6xl">Вы бар или группа?</h2>
            <p class="mt-4 max-w-lg text-white/85">
              Публикуйте афишу, продавайте билеты и принимайте брони столиков. Joined приведёт к вам гостей, которые любят именно вашу музыку.
            </p>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row md:justify-end">
            <NuxtLink to="/register?role=venue" class="btn-primary bg-black py-3.5 hover:bg-black/80">Добавить заведение</NuxtLink>
            <NuxtLink to="/register?role=artist" class="btn-primary bg-white/15 py-3.5 hover:bg-white/25">Я музыкант</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

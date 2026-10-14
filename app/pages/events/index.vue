<script setup lang="ts">
import type { GenreId } from '~/data/types'
import { events, genres, getVenue, isUpcoming, todayISO } from '~/data/catalog'

useHead({ title: 'Афиша — Joined' })

const route = useRoute()
const { cityId, city } = useCity()
const genre = ref<GenreId | ''>((route.query.genre as GenreId) ?? '')

const periods = [
  { id: 'today', name: 'Сегодня' },
  { id: 'tomorrow', name: 'Завтра' },
  { id: 'weekend', name: 'Выходные' },
  { id: 'week', name: 'Неделя' },
  { id: 'month', name: 'Месяц' },
] as const
type Period = typeof periods[number]['id']
const period = ref<Period | ''>('')

const inPeriod = (date: string) => {
  const today = todayISO()
  switch (period.value) {
    case 'today': return date === today
    case 'tomorrow': return date === addDays(today, 1)
    case 'weekend': return date <= addDays(today, 7) && isWeekend(date)
    case 'week': return date <= addDays(today, 7)
    case 'month': return date <= addDays(today, 31)
    default: return true
  }
}

const list = computed(() =>
  events
    .filter(e => isUpcoming(e) && getVenue(e.venue)?.city === cityId.value)
    .filter(e => !genre.value || e.genres.includes(genre.value))
    .filter(e => inPeriod(e.date))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
)

/** Группировка по датам для «ленты» */
const grouped = computed(() => {
  const map = new Map<string, typeof list.value>()
  for (const e of list.value) map.set(e.date, [...(map.get(e.date) ?? []), e])
  return [...map.entries()]
})
</script>

<template>
  <div>
    <section class="container-x pt-10 pb-10 text-center sm:pt-16">
      <h1 class="h-display text-[16vw] sm:text-8xl lg:text-[8.5rem]">Афиша</h1>
      <p class="mt-4 text-soft">Концерты, джем-сейшены и вечеринки {{ city.where }}</p>
      <div class="mt-8 flex justify-center"><CitySelect /></div>
      <div class="mt-6"><FilterPills v-model="genre" :options="genres" center /></div>
      <div class="mt-3"><FilterPills v-model="period" :options="[...periods]" all-label="Любая дата" center /></div>
    </section>

    <section class="container-x">
      <div v-if="grouped.length" class="space-y-14">
        <div v-for="[date, items] in grouped" :key="date">
          <div class="mb-5 flex items-baseline gap-3 border-b border-line pb-3">
            <h2 class="text-2xl font-medium tracking-tight capitalize sm:text-3xl">{{ formatDay(date) }}</h2>
            <span class="text-sm capitalize" :class="isWeekend(date) ? 'text-accent-text' : 'text-muted'">{{ formatWeekdayLong(date) }}</span>
          </div>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <EventCard v-for="e in items" :key="e.id" :event="e" />
          </div>
        </div>
      </div>
      <EmptyState v-else icon="calendar" title="Событий не найдено" text="Попробуйте выбрать другой жанр, дату или город.">
        <button class="btn-dark" @click="genre = ''; period = ''">Сбросить фильтры</button>
      </EmptyState>
    </section>
  </div>
</template>

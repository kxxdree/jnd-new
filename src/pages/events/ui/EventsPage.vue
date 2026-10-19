<script setup lang="ts">
import { useCurrentCity } from '@entities/city'
import { byDateTime, EventCard, type EventItem, events, isUpcoming } from '@entities/event'
import { getVenue } from '@entities/venue'
import { CitySelect } from '@features/select-city'
import { type GenreId, genres } from '@shared/config'
import { addDays, formatDay, formatWeekdayLong, isWeekend, todayISO } from '@shared/lib'
import { UiEmpty, UiPills } from '@shared/ui'

useHead({ title: 'Афиша - Joined' })

const route = useRoute()
const { cityId, city } = useCurrentCity()
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

const grouped = computed(() => {
  const list = events
    .filter(e => isUpcoming(e) && getVenue(e.venue)?.city === cityId.value)
    .filter(e => !genre.value || e.genres.includes(genre.value))
    .filter(e => inPeriod(e.date))
    .sort(byDateTime)
  const map = new Map<string, EventItem[]>()
  for (const e of list) map.set(e.date, [...(map.get(e.date) ?? []), e])
  return [...map.entries()]
})
</script>

<template>
  <div>
    <section class="container-x pt-12 pb-12 text-center sm:pt-20">
      <h1 class="h-display text-[17vw] sm:text-8xl lg:text-[9rem]">Афи<span class="text-liquid italic">ша</span></h1>
      <p class="mt-4 text-white/80">Концерты, джем-сейшены и вечеринки {{ city.where }}</p>
      <div class="mt-8 flex justify-center"><CitySelect /></div>
      <div class="mt-6"><UiPills v-model="genre" :options="genres" center /></div>
      <div class="mt-3"><UiPills v-model="period" :options="periods" all-label="Любая дата" center /></div>
    </section>

    <section class="container-x">
      <div v-if="grouped.length" class="space-y-14">
        <div v-for="[date, items] in grouped" :key="date">
          <div class="glass mb-5 inline-flex items-baseline gap-3 rounded-full px-5 py-2.5">
            <h2 class="text-xl font-medium tracking-tight sm:text-2xl">{{ formatDay(date) }}</h2>
            <span class="text-sm capitalize" :class="isWeekend(date) ? 'text-accent-text' : 'text-muted'">{{ formatWeekdayLong(date) }}</span>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <EventCard v-for="e in items" :key="e.id" :event="e" :venue-name="getVenue(e.venue)?.name" />
          </div>
        </div>
      </div>
      <UiEmpty v-else icon="calendar" title="Событий не найдено" text="Попробуйте выбрать другой жанр, дату или город.">
        <button class="btn-dark" @click="genre = ''; period = ''">Сбросить фильтры</button>
      </UiEmpty>
    </section>
  </div>
</template>

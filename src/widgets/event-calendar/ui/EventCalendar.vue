<script setup lang="ts">
import { getArtist } from '@entities/artist'
import { type EventItem, minPrice } from '@entities/event'
import {
  addDays, dayNumber, formatDay, formatPrice, formatWeekday, formatWeekdayLong, isWeekend, monthGrid, todayISO,
} from '@shared/lib'
import { UiIcon, UiPhoto } from '@shared/ui'

/** Музыкальный календарь заведения: неделя / месяц + лайнап ближайших выходных */
const props = defineProps<{ events: EventItem[] }>()

const view = ref<'week' | 'month'>('week')
const today = todayISO()
const selected = ref(today)
const monthOffset = ref(0)

const byDate = computed(() => {
  const map = new Map<string, EventItem[]>()
  for (const e of props.events) map.set(e.date, [...(map.get(e.date) ?? []), e])
  return map
})

const week = computed(() => Array.from({ length: 7 }, (_, i) => addDays(today, i)))
const month = computed(() => monthGrid(today, monthOffset.value))
const dayEvents = computed(() => byDate.value.get(selected.value) ?? [])
const weekendLineup = computed(() => week.value.filter(isWeekend).flatMap(d => byDate.value.get(d) ?? []))

const artistNames = (e: EventItem) =>
  e.artists.map(a => getArtist(a)?.name).filter(Boolean).join(', ') || 'Резиденты заведения'
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
    <div class="card p-4 sm:p-6">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div class="segmented">
          <button :aria-pressed="view === 'week'" @click="view = 'week'">Неделя</button>
          <button :aria-pressed="view === 'month'" @click="view = 'month'">Месяц</button>
        </div>
        <div v-if="view === 'month'" class="flex items-center gap-2">
          <button class="btn-icon size-9" aria-label="Предыдущий месяц" :disabled="monthOffset <= 0" @click="monthOffset--"><UiIcon name="chevron-left" :size="16" /></button>
          <span class="min-w-32 text-center text-sm capitalize">{{ month.title }}</span>
          <button class="btn-icon size-9" aria-label="Следующий месяц" @click="monthOffset++"><UiIcon name="chevron-right" :size="16" /></button>
        </div>
      </div>

      <!-- Неделя -->
      <div v-if="view === 'week'" class="grid grid-cols-7 gap-1.5">
        <button
          v-for="d in week"
          :key="d"
          class="flex flex-col items-center rounded-2xl py-3 transition-all duration-300"
          :class="selected === d ? 'pill-active' : 'bg-white/5 hover:bg-white/10'"
          @click="selected = d"
        >
          <span class="text-[11px] uppercase" :class="selected === d ? 'text-white/85' : isWeekend(d) ? 'text-accent-text' : 'text-muted'">{{ formatWeekday(d) }}</span>
          <span class="mt-1 text-lg font-medium">{{ dayNumber(d) }}</span>
          <span class="mt-1 size-1.5 rounded-full" :class="byDate.get(d) ? (selected === d ? 'bg-white' : 'bg-accent shadow-[0_0_6px_#ff4d00]') : ''" />
        </button>
      </div>

      <!-- Месяц -->
      <div v-else>
        <div class="mb-1.5 grid grid-cols-7 gap-1.5 text-center text-[11px] text-muted uppercase">
          <span v-for="w in ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']" :key="w">{{ w }}</span>
        </div>
        <div class="grid grid-cols-7 gap-1.5">
          <template v-for="(d, i) in month.cells" :key="i">
            <span v-if="!d" />
            <button
              v-else
              class="relative aspect-square rounded-2xl text-sm transition-all duration-300 disabled:opacity-25"
              :class="selected === d ? 'pill-active' : byDate.get(d) ? 'bg-white/12 hover:bg-white/18' : 'bg-white/4'"
              :disabled="d < today"
              @click="selected = d"
            >
              {{ dayNumber(d) }}
              <span v-if="byDate.get(d)" class="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full" :class="selected === d ? 'bg-white' : 'bg-accent'" />
            </button>
          </template>
        </div>
      </div>

      <!-- События выбранного дня -->
      <div class="mt-6">
        <h3 class="mb-3 text-sm text-muted capitalize">{{ formatWeekdayLong(selected) }}, {{ formatDay(selected) }}</h3>
        <div v-if="dayEvents.length" class="grid gap-2">
          <NuxtLink v-for="e in dayEvents" :key="e.id" :to="`/events/${e.id}`" class="group flex items-center gap-4 rounded-3xl bg-white/5 p-2 pr-4 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] transition-colors hover:bg-white/10">
            <UiPhoto :src="e.photo" class="size-16 shrink-0 rounded-2xl" />
            <div class="min-w-0 flex-1">
              <p class="truncate font-medium group-hover:text-sand">{{ e.title }}</p>
              <p class="truncate text-sm text-muted">{{ e.time }} · {{ artistNames(e) }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-muted">вход</p>
              <p class="text-sm whitespace-nowrap">от {{ formatPrice(minPrice(e)) }}</p>
            </div>
          </NuxtLink>
        </div>
        <p v-else class="rounded-3xl bg-white/5 p-5 text-sm text-muted">В этот день выступлений нет - бар работает в обычном режиме.</p>
      </div>
    </div>

    <!-- Лайнап выходных -->
    <aside class="card h-fit p-5 sm:p-6">
      <div class="mb-5 flex items-center gap-2">
        <span class="glass-chip grid size-9 place-items-center rounded-full text-accent-text"><UiIcon name="music" :size="18" /></span>
        <h3 class="text-lg font-medium">Лайнап на выходные</h3>
      </div>
      <ol v-if="weekendLineup.length" class="space-y-4">
        <li v-for="e in weekendLineup" :key="e.id" class="flex gap-4">
          <div class="w-12 shrink-0 text-center">
            <div class="text-xs text-accent-text uppercase">{{ formatWeekday(e.date) }}</div>
            <div class="text-xl font-medium">{{ e.time }}</div>
          </div>
          <div class="min-w-0 border-l border-line pl-4">
            <NuxtLink :to="`/events/${e.id}`" class="font-medium hover:text-sand">{{ e.title }}</NuxtLink>
            <p class="text-sm text-muted">{{ artistNames(e) }} · от {{ formatPrice(minPrice(e)) }}</p>
          </div>
        </li>
      </ol>
      <p v-else class="text-sm text-muted">Лайнап на ближайшие выходные ещё формируется.</p>
    </aside>
  </div>
</template>

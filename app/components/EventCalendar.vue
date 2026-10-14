<script setup lang="ts">
import type { EventItem } from '~/data/types'
import { getArtist, minPrice, todayISO } from '~/data/catalog'

const props = defineProps<{ events: EventItem[] }>()

const view = ref<'week' | 'month'>('week')
const today = todayISO()
const selected = ref(today)

const byDate = computed(() => {
  const map = new Map<string, EventItem[]>()
  for (const e of props.events) map.set(e.date, [...(map.get(e.date) ?? []), e])
  return map
})

const week = computed(() => Array.from({ length: 7 }, (_, i) => addDays(today, i)))

// Сетка месяца (пн — первый день недели)
const monthOffset = ref(0)
const monthGrid = computed(() => {
  const base = new Date(`${today}T12:00:00`)
  base.setDate(1)
  base.setMonth(base.getMonth() + monthOffset.value)
  const first = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}-01`
  const lead = (base.getDay() + 6) % 7
  const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
  const cells: (string | null)[] = Array(lead).fill(null)
  for (let i = 0; i < daysInMonth; i++) cells.push(addDays(first, i))
  return {
    title: base.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }),
    cells,
  }
})

const dayEvents = computed(() => byDate.value.get(selected.value) ?? [])

const weekendLineup = computed(() =>
  week.value.filter(isWeekend).flatMap(d => byDate.value.get(d) ?? []),
)

const artistNames = (e: EventItem) => e.artists.map(a => getArtist(a)?.name).filter(Boolean).join(', ') || 'Резиденты заведения'
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
    <div>
      <div class="mb-5 flex items-center justify-between gap-3">
        <div class="inline-grid grid-cols-2 gap-1 rounded-xl bg-card p-1">
          <button class="rounded-lg px-4 py-1.5 text-sm" :class="view === 'week' ? 'bg-card-2' : 'text-muted'" @click="view = 'week'">Неделя</button>
          <button class="rounded-lg px-4 py-1.5 text-sm" :class="view === 'month' ? 'bg-card-2' : 'text-muted'" @click="view = 'month'">Месяц</button>
        </div>
        <div v-if="view === 'month'" class="flex items-center gap-2">
          <button class="grid size-8 place-items-center rounded-full bg-card-2" aria-label="Предыдущий месяц" :disabled="monthOffset <= 0" @click="monthOffset--"><AppIcon name="chevron-left" :size="16" /></button>
          <span class="min-w-32 text-center text-sm capitalize">{{ monthGrid.title }}</span>
          <button class="grid size-8 place-items-center rounded-full bg-card-2" aria-label="Следующий месяц" @click="monthOffset++"><AppIcon name="chevron-right" :size="16" /></button>
        </div>
      </div>

      <!-- Неделя -->
      <div v-if="view === 'week'" class="grid grid-cols-7 gap-1.5">
        <button
          v-for="d in week"
          :key="d"
          class="relative flex flex-col items-center rounded-xl py-3 transition-colors"
          :class="selected === d ? 'bg-accent' : 'bg-card hover:bg-card-2'"
          @click="selected = d"
        >
          <span class="text-[11px] uppercase" :class="selected === d ? 'text-white/80' : isWeekend(d) ? 'text-accent-text' : 'text-muted'">{{ formatWeekday(d) }}</span>
          <span class="mt-1 text-lg font-medium">{{ dayNumber(d) }}</span>
          <span v-if="byDate.get(d)" class="mt-1 size-1.5 rounded-full" :class="selected === d ? 'bg-white' : 'bg-accent'" />
          <span v-else class="mt-1 size-1.5" />
        </button>
      </div>

      <!-- Месяц -->
      <div v-else>
        <div class="mb-1.5 grid grid-cols-7 gap-1.5 text-center text-[11px] text-muted uppercase">
          <span v-for="w in ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']" :key="w">{{ w }}</span>
        </div>
        <div class="grid grid-cols-7 gap-1.5">
          <template v-for="(d, i) in monthGrid.cells" :key="i">
            <span v-if="!d" />
            <button
              v-else
              class="relative aspect-square rounded-xl text-sm transition-colors disabled:opacity-30"
              :class="selected === d ? 'bg-accent' : byDate.get(d) ? 'bg-card-2 hover:bg-card-3' : 'bg-card'"
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
          <NuxtLink v-for="e in dayEvents" :key="e.id" :to="`/events/${e.id}`" class="card group flex items-center gap-4 p-3 pr-4">
            <PhotoImg :src="e.photo" class="size-16 shrink-0 rounded-xl" />
            <div class="min-w-0 flex-1">
              <p class="truncate font-medium group-hover:text-accent-text">{{ e.title }}</p>
              <p class="truncate text-sm text-muted">{{ e.time }} · {{ artistNames(e) }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-muted">вход</p>
              <p class="text-sm whitespace-nowrap">от {{ formatPrice(minPrice(e)) }}</p>
            </div>
          </NuxtLink>
        </div>
        <p v-else class="card p-5 text-sm text-muted">В этот день выступлений нет — бар работает в обычном режиме.</p>
      </div>
    </div>

    <!-- Лайнап выходных -->
    <aside class="card h-fit p-5 sm:p-6">
      <div class="mb-4 flex items-center gap-2">
        <AppIcon name="music" class="text-accent" />
        <h3 class="text-lg font-medium">Лайнап на выходные</h3>
      </div>
      <ol v-if="weekendLineup.length" class="space-y-4">
        <li v-for="e in weekendLineup" :key="e.id" class="flex gap-4">
          <div class="w-12 shrink-0 text-center">
            <div class="text-xs text-accent-text uppercase">{{ formatWeekday(e.date) }}</div>
            <div class="text-xl font-medium">{{ e.time }}</div>
          </div>
          <div class="min-w-0 border-l border-line pl-4">
            <NuxtLink :to="`/events/${e.id}`" class="font-medium hover:text-accent-text">{{ e.title }}</NuxtLink>
            <p class="text-sm text-muted">{{ artistNames(e) }} · от {{ formatPrice(minPrice(e)) }}</p>
          </div>
        </li>
      </ol>
      <p v-else class="text-sm text-muted">Лайнап на ближайшие выходные ещё формируется.</p>
    </aside>
  </div>
</template>

<script setup lang="ts">
import type { GenreId } from '~/data/types'
import type { VenueFilterState } from '~/components/VenueFilters.vue'
import { events, genres, venues } from '~/data/catalog'

useHead({ title: 'Бары и площадки — Joined' })

const route = useRoute()
const { cityId, city } = useCity()

const q = ref(String(route.query.q ?? ''))
const genre = ref<GenreId[]>(route.query.genre ? [route.query.genre as GenreId] : [])
const filters = ref<VenueFilterState>({ formats: [], drinks: [], date: '', time: '', sort: 'rating' })
const showFilters = ref(false)
const showFiltersModal = ref(false)
const toggleFilters = () => {
  if (window.matchMedia('(min-width: 768px)').matches) showFilters.value = !showFilters.value
  else showFiltersModal.value = true
}
const mobileView = ref<'list' | 'map'>('list')
const active = ref<string | null>(null)

const activeCount = computed(() =>
  filters.value.formats.length + filters.value.drinks.length + (filters.value.date ? 1 : 0) + (filters.value.time ? 1 : 0),
)

const results = computed(() => {
  const f = filters.value
  const needle = q.value.trim().toLowerCase()

  // заведения, где есть выступления в выбранную дату/время
  let withShows: Set<string> | null = null
  if (f.date || f.time) {
    withShows = new Set(
      events
        .filter(e => (!f.date || e.date === f.date)
          && (!f.time || (f.time === 'evening' ? e.time < '22:00' : e.time >= '22:00')))
        .map(e => e.venue),
    )
  }

  const list = venues.filter(v =>
    v.city === cityId.value
    && (!needle || [v.name, v.short, v.address, v.metro ?? ''].some(s => s.toLowerCase().includes(needle)))
    && (!genre.value.length || genre.value.some(g => v.genres.includes(g)))
    && (!f.formats.length || f.formats.includes(v.format))
    && (!f.drinks.length || f.drinks.every(d => v.drinks.includes(d)))
    && (!withShows || withShows.has(v.slug)),
  )

  const sorters = {
    rating: (a: typeof list[number], b: typeof list[number]) => b.rating - a.rating,
    reviews: (a: typeof list[number], b: typeof list[number]) => b.reviewsCount - a.reviewsCount,
    price: (a: typeof list[number], b: typeof list[number]) => a.avgCheck - b.avgCheck,
  }
  return list.sort(sorters[f.sort])
})

const reset = () => {
  q.value = ''
  genre.value = []
  filters.value = { formats: [], drinks: [], date: '', time: '', sort: 'rating' }
}
</script>

<template>
  <div>
    <section class="container-x pt-10 pb-8 text-center sm:pt-16">
      <h1 class="h-display text-[14vw] sm:text-8xl">Бары &amp; сцены</h1>
      <p class="mt-4 text-soft">{{ results.length }} {{ plural(results.length, ['заведение', 'заведения', 'заведений']) }} {{ city.where }}</p>
    </section>

    <!-- Панель поиска -->
    <section class="container-x">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <CitySelect />
        <label class="flex flex-1 items-center gap-3 rounded-xl bg-card-2 px-4">
          <AppIcon name="search" class="text-muted" :size="18" />
          <input v-model="q" type="search" placeholder="Название, улица или метро" class="w-full bg-transparent py-2.5 text-sm placeholder:text-muted" aria-label="Поиск по заведениям">
        </label>
        <button class="pill justify-center" :class="{ 'pill-active': showFilters }" @click="toggleFilters">
          <AppIcon name="filter" :size="16" /> Фильтры
          <span v-if="activeCount" class="grid size-5 place-items-center rounded-full bg-white text-xs text-black">{{ activeCount }}</span>
        </button>
      </div>

      <div class="mt-4">
        <FilterPills v-model="genre" :options="genres" multiple />
      </div>

      <!-- Десктоп: раскрывающаяся панель -->
      <div v-if="showFilters" class="card mt-4 hidden p-6 md:block">
        <VenueFilters v-model="filters" />
        <div class="mt-6 flex justify-end">
          <button class="text-sm text-muted hover:text-white" @click="reset">Сбросить всё</button>
        </div>
      </div>
      <!-- Мобайл: модальное окно -->
      <AppModal v-model="showFiltersModal" title="Фильтры">
        <VenueFilters v-model="filters" />
        <div class="mt-8 grid grid-cols-2 gap-2">
          <button class="btn-dark py-3.5" @click="reset">Сбросить</button>
          <button class="btn-primary py-3.5" @click="showFiltersModal = false">Показать {{ results.length }}</button>
        </div>
      </AppModal>

      <!-- Переключатель список/карта (мобайл) -->
      <div class="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-card p-1 lg:hidden">
        <button class="rounded-lg py-2 text-sm" :class="mobileView === 'list' ? 'bg-card-2 text-white' : 'text-muted'" @click="mobileView = 'list'">
          <AppIcon name="list" :size="16" class="mr-1 inline" /> Список
        </button>
        <button class="rounded-lg py-2 text-sm" :class="mobileView === 'map' ? 'bg-card-2 text-white' : 'text-muted'" @click="mobileView = 'map'">
          <AppIcon name="map" :size="16" class="mr-1 inline" /> Карта
        </button>
      </div>
    </section>

    <!-- Результаты -->
    <section class="container-x mt-6 grid gap-4 lg:grid-cols-[1fr_minmax(0,0.85fr)]">
      <div :class="mobileView === 'map' ? 'hidden lg:block' : ''">
        <div v-if="results.length" class="grid gap-3 sm:grid-cols-2">
          <div v-for="v in results" :key="v.slug" @mouseenter="active = v.slug">
            <VenueCard :venue="v" :active="active === v.slug" />
          </div>
        </div>
        <EmptyState v-else icon="glass" title="Ничего не нашлось" text="Попробуйте убрать часть фильтров или выбрать другой город.">
          <button class="btn-dark" @click="reset">Сбросить фильтры</button>
        </EmptyState>
      </div>

      <div :class="mobileView === 'list' ? 'hidden lg:block' : ''">
        <div class="sticky top-24 h-[70vh] overflow-hidden rounded-card border border-line lg:h-[calc(100vh-8rem)]">
          <ClientOnly><VenueMap :venues="results" :center="city" :active="active" @select="active = $event" /></ClientOnly>
        </div>
      </div>
    </section>
  </div>
</template>

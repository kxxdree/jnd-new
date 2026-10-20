<script setup lang="ts">
import { useCurrentCity } from "@entities/city";
import { events } from "@entities/event";
import { VenueCard, venues } from "@entities/venue";
import { FavoriteButton } from "@features/favorites";
import { applyVenueFilters, countExtra, emptyFilters, VenueFilters, type VenueFilterState } from "@features/filter-venues";
import { CitySelect } from "@features/select-city";
import { type GenreId, genres } from "@shared/config";
import { plural } from "@shared/lib";
import { UiEmpty, UiIcon, UiModal, UiPills } from "@shared/ui";

useHead({ title: "Бары и площадки - Joined" });

const route = useRoute();
const { cityId, city } = useCurrentCity();

const filters = ref<VenueFilterState>({
  ...emptyFilters(),
  q: String(route.query.q ?? ""),
  genres: route.query.genre ? [route.query.genre as GenreId] : [],
});
const results = computed(() =>
  applyVenueFilters(
    venues.filter((v) => v.city === cityId.value),
    events,
    filters.value,
  ),
);
const extraCount = computed(() => countExtra(filters.value));

const panelOpen = ref(false);
const sheetOpen = ref(false);
const toggleFilters = () => {
  if (window.matchMedia("(min-width: 768px)").matches) panelOpen.value = !panelOpen.value;
  else sheetOpen.value = true;
};

const reset = () => {
  filters.value = emptyFilters();
};
</script>

<template>
  <div>
    <section class="container-x pt-12 pb-10 text-center sm:pt-20">
      <h1 class="h-display text-[14vw] sm:text-8xl lg:text-[8.5rem]">Бары и сцены</h1>
      <p class="mt-4 text-white/80">{{ results.length }} {{ plural(results.length, ["место", "места", "мест"]) }} {{ city.where }}</p>
    </section>

    <!-- Панель поиска -->
    <section class="container-x">
      <div class="glass z-30 flex flex-col gap-2 rounded-4xl p-2 sm:flex-row sm:items-center sm:rounded-full">
        <CitySelect />
        <label class="flex flex-1 items-center gap-3 px-3">
          <UiIcon name="search" class="text-white/60" :size="18" />
          <input
            v-model="filters.q"
            type="search"
            placeholder="Название, улица или метро"
            class="w-full bg-transparent py-2.5 text-sm placeholder:text-white/50"
            aria-label="Поиск по заведениям"
          />
        </label>
        <button class="pill justify-center" :class="{ 'pill-active': panelOpen }" @click="toggleFilters">
          <UiIcon name="filter" :size="16" /> Фильтры
          <span v-if="extraCount" class="grid size-5 place-items-center rounded-full bg-white text-xs text-black">{{ extraCount }}</span>
        </button>
      </div>

      <div class="mt-4">
        <UiPills v-model="filters.genres" :options="genres" multiple />
      </div>

      <!-- Десктоп: раскрывающаяся панель -->
      <Transition
        enter-active-class="transition duration-400 ease-[var(--ease-liquid)]"
        enter-from-class="opacity-0 -translate-y-2"
        leave-active-class="transition duration-200"
        leave-to-class="opacity-0"
      >
        <div v-if="panelOpen" class="card mt-4 hidden p-6 md:block">
          <VenueFilters v-model="filters" />
          <div class="mt-6 flex justify-end">
            <button class="btn-ghost" @click="reset">Сбросить всё</button>
          </div>
        </div>
      </Transition>

      <!-- Мобайл: стеклянный лист -->
      <UiModal v-model="sheetOpen" title="Фильтры">
        <VenueFilters v-model="filters" />
        <div class="mt-8 grid grid-cols-2 gap-2">
          <button class="btn-dark py-3.5" @click="reset">Сбросить</button>
          <button class="btn-primary py-3.5" @click="sheetOpen = false">Показать {{ results.length }}</button>
        </div>
      </UiModal>
    </section>

    <!-- Результаты: сетка карточек -->
    <section class="container-x mt-8">
      <div v-if="results.length" class="grid sm:grid-cols-2 lg:grid-cols-3">
        <VenueCard v-for="v in results" :key="v.slug" :venue="v">
          <template #actions><FavoriteButton kind="venues" :id="v.slug" /></template>
        </VenueCard>
      </div>
      <UiEmpty v-else icon="glass" title="Ничего не нашлось">
        <button class="btn-dark" @click="reset">Сбросить фильтры</button>
      </UiEmpty>
    </section>
  </div>
</template>

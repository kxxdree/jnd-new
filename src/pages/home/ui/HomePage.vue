<script setup lang="ts">
import { artists } from "@entities/artist";
import { useCurrentCity } from "@entities/city";
import { byDateTime, EventCard, events, isUpcoming } from "@entities/event";
import { getVenue, VenueCard, venues } from "@entities/venue";
import { FavoriteButton } from "@features/favorites";
import { CitySelect } from "@features/select-city";
import { type GenreId, genres } from "@shared/config";
import { UiBackdrop, UiEmpty, UiSectionHead, UiSelect } from "@shared/ui";

useHead({ title: "JOINED" });

const { cityId, city } = useCurrentCity();
const genre = ref<GenreId | "">("");

const cityVenues = computed(() => venues.filter((v) => v.city === cityId.value));
const cityVenueSlugs = computed(() => new Set(cityVenues.value.map((v) => v.slug)));

const upcoming = computed(() =>
  events
    .filter((e) => isUpcoming(e) && cityVenueSlugs.value.has(e.venue))
    .sort(byDateTime)
    .slice(0, 6),
);

const popularVenues = computed(() => [...cityVenues.value].sort((a, b) => b.popularity - a.popularity).slice(0, 3));

const search = () => navigateTo({ path: "/venues", query: { genre: genre.value || undefined } });

const stats = [
  { value: venues.length * 37, label: "баров и площадок" },
  { value: events.length * 61, label: "событий в месяц" },
  { value: artists.length * 54, label: "музыкантов и групп" },
];
</script>

<template>
  <div>
    <!-- HERO: на всю высоту вьюпорта, заезжает под sticky-хедер (h-16 + pt-3 / sm:pt-4) -->
    <section class="relative isolate -mt-19 flex min-h-dvh flex-col justify-center pt-19 sm:-mt-20 sm:pt-20">
      <UiBackdrop />
      <div class="container-x py-14 text-center sm:py-24">
        <h1 class="h-display text-[15vw] sm:text-8xl lg:text-[9rem]">Найди свой звук сегодня</h1>
        <!-- <p class="mx-auto mt-7 max-w-xl text-base text-white/80 sm:text-lg">
          Бары, концерты и джем-сейшены - по жанрам, с расписанием выступлений и билетами в пару кликов
        </p> -->

        <!-- Подбор по городу и жанру: жанр уходит в фильтры страницы мест -->
        <!-- На мобильных - в колонку, чтобы названия не обрезались -->
        <form class="search-bar mx-auto mt-10 flex max-w-md flex-col gap-2 p-2 text-left sm:flex-row" @submit.prevent="search">
          <CitySelect inline class="h-12 shrink-0 border-b border-white/15 pb-2 sm:h-auto sm:border-r sm:border-b-0 sm:pr-1 sm:pb-0" />
          <UiSelect v-model="genre" :options="genres" all-label="Любой жанр" icon="music" label="Жанр" inline class="h-12 min-w-0 sm:h-auto sm:flex-1" />
          <button class="btn-primary px-6 py-3 sm:py-2" type="submit">Найти</button>
        </form>
      </div>
    </section>

    <!-- БЛИЖАЙШИЕ СОБЫТИЯ -->
    <section class="container-x mt-28">
      <UiSectionHead eyebrow="Афиша" title="Ближайшие события" to="/events" link-label="Вся афиша" />
      <div v-if="upcoming.length" class="grid sm:grid-cols-2 lg:grid-cols-3">
        <EventCard v-for="e in upcoming" :key="e.id" :event="e" :venue-name="getVenue(e.venue)?.name" />
      </div>
      <UiEmpty v-else icon="calendar" title="Пока нет событий" text="Попробуйте другой город - афиша обновляется каждый день." />
      <NuxtLink to="/events" class="btn-dark mt-4 w-full sm:hidden">Вся афиша</NuxtLink>
    </section>

    <!-- СТАТИСТИКА (временно скрыта) -->
    <section v-if="false" class="container-x mt-28">
      <div class="glass grid grid-cols-3 divide-x divide-line rounded-4xl">
        <div v-for="s in stats" :key="s.label" class="p-4 text-center sm:p-10">
          <div class="h-display text-3xl sm:text-7xl">{{ s.value }}+</div>
          <div class="mt-2 text-xs text-white/70 sm:text-sm">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- ПОПУЛЯРНЫЕ БАРЫ -->
    <section class="container-x mt-28">
      <UiSectionHead
        eyebrow="Рядом"
        title="Места твоего города"
        :subtitle="`Бары и сцены ${city.where}`"
        to="/venues"
        link-label="Все заведения"
      />
      <div v-if="popularVenues.length" class="grid sm:grid-cols-2 lg:grid-cols-3">
        <VenueCard v-for="v in popularVenues" :key="v.slug" :venue="v">
          <template #actions><FavoriteButton kind="venues" :id="v.slug" /></template>
        </VenueCard>
      </div>
      <UiEmpty v-else icon="glass" title="Ничего не нашлось" text="В этом городе пока нет заведений." />
    </section>
  </div>
</template>

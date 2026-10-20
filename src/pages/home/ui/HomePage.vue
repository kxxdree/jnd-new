<script setup lang="ts">
import { ArtistCard, artists } from "@entities/artist";
import { cityName, useCurrentCity } from "@entities/city";
import { byDateTime, EventCard, events, isUpcoming } from "@entities/event";
import { getVenue, VenueCard, venues } from "@entities/venue";
import { FavoriteButton } from "@features/favorites";
import { CitySelect } from "@features/select-city";
import { UiBackdrop, UiEmpty, UiIcon, UiSectionHead } from "@shared/ui";

useHead({ title: "JOINED" });

const { cityId, city } = useCurrentCity();
const query = ref("");

const cityVenues = computed(() => venues.filter((v) => v.city === cityId.value));
const cityVenueSlugs = computed(() => new Set(cityVenues.value.map((v) => v.slug)));

const upcoming = computed(() =>
  events
    .filter((e) => isUpcoming(e) && cityVenueSlugs.value.has(e.venue))
    .sort(byDateTime)
    .slice(0, 6),
);

const popularVenues = computed(() => [...cityVenues.value].sort((a, b) => b.popularity - a.popularity).slice(0, 3));

const topArtists = [...artists].sort((a, b) => b.followers - a.followers).slice(0, 4);

const search = () => navigateTo({ path: "/venues", query: { q: query.value || undefined } });

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
        <div class="mb-8 flex justify-center">
          <CitySelect />
        </div>
        <h1 class="h-display text-[15vw] sm:text-8xl lg:text-[9rem]">Найди свой звук сегодня</h1>
        <p class="mx-auto mt-7 max-w-xl text-base text-white/80 sm:text-lg">
          Бары, концерты и джем-сейшены - по жанрам, с расписанием выступлений и билетами в пару кликов
        </p>

        <form class="glass lg-refract mx-auto mt-10 flex max-w-xl gap-2 rounded-full p-2 [--lg-refract-blur:12px]" role="search" @submit.prevent="search">
          <label class="flex flex-1 items-center gap-3 pl-4">
            <UiIcon name="search" class="text-white/60" />
            <input
              v-model="query"
              type="search"
              placeholder="Бар, артист или жанр"
              class="w-full bg-transparent py-2 text-sm placeholder:text-white/50"
              aria-label="Поиск"
            />
          </label>
          <button class="btn-primary px-6" type="submit">Найти</button>
        </form>
      </div>
    </section>

    <!-- БЛИЖАЙШИЕ СОБЫТИЯ -->
    <section class="container-x">
      <UiSectionHead eyebrow="Афиша" title="Ближайшие события" to="/events" link-label="Вся афиша" />
      <div v-if="upcoming.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        eyebrow="Популярное"
        title="Популярные бары"
        :subtitle="`Места, о которых говорят · ${city.name}`"
        to="/venues"
        link-label="Все заведения"
      />
      <div v-if="popularVenues.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <VenueCard v-for="v in popularVenues" :key="v.slug" :venue="v">
          <template #actions><FavoriteButton kind="venues" :id="v.slug" /></template>
        </VenueCard>
      </div>
      <UiEmpty v-else icon="glass" title="Ничего не нашлось" text="В этом городе пока нет заведений." />
    </section>

    <!-- АРТИСТЫ -->
    <section class="container-x mt-28">
      <UiSectionHead eyebrow="Сцена" title="Артисты" subtitle="Группы и музыканты, которых стоит услышать вживую" to="/artists" link-label="Все артисты" />
      <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <ArtistCard v-for="a in topArtists" :key="a.slug" :artist="a" :city-label="cityName(a.city)" />
      </div>
    </section>
  </div>
</template>

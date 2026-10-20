<script setup lang="ts">
import { useCurrentCity } from "@entities/city";
import { byDateTime, type EventItem, events, isUpcoming, minPrice } from "@entities/event";
import { getVenue } from "@entities/venue";
import { CitySelect } from "@features/select-city";
import { type GenreId, genres } from "@shared/config";
import { addDays, dayNumber, formatPrice, formatWeekdayLong, isWeekend, monthShort, todayISO } from "@shared/lib";
import { UiEmpty, UiPills } from "@shared/ui";

useHead({ title: "Афиша - Joined" });

const route = useRoute();
const { cityId, city } = useCurrentCity();
const genre = ref<GenreId | "">((route.query.genre as GenreId) ?? "");

const periods = [
  { id: "today", name: "Сегодня" },
  { id: "tomorrow", name: "Завтра" },
  { id: "weekend", name: "Выходные" },
  { id: "week", name: "Неделя" },
  { id: "month", name: "Месяц" },
] as const;
type Period = (typeof periods)[number]["id"];
const period = ref<Period | "">("");

const inPeriod = (date: string) => {
  const today = todayISO();
  switch (period.value) {
    case "today":
      return date === today;
    case "tomorrow":
      return date === addDays(today, 1);
    case "weekend":
      return date <= addDays(today, 7) && isWeekend(date);
    case "week":
      return date <= addDays(today, 7);
    case "month":
      return date <= addDays(today, 31);
    default:
      return true;
  }
};

const grouped = computed(() => {
  const list = events
    .filter((e) => isUpcoming(e) && getVenue(e.venue)?.city === cityId.value)
    .filter((e) => !genre.value || e.genres.includes(genre.value))
    .filter((e) => inPeriod(e.date))
    .sort(byDateTime);
  const map = new Map<string, EventItem[]>();
  for (const e of list) map.set(e.date, [...(map.get(e.date) ?? []), e]);
  return [...map.entries()];
});
</script>

<template>
  <div>
    <section class="container-x pt-12 pb-12 text-center sm:pt-20">
      <h1 class="h-display text-[17vw] sm:text-8xl lg:text-[9rem]">Афиша</h1>
      <p class="mt-4 text-white/80">Концерты, джем-сейшены и вечеринки</p>
      <div class="mt-8 flex justify-center"><CitySelect /></div>
      <div class="mt-6"><UiPills v-model="genre" :options="genres" center /></div>
      <div class="mt-3"><UiPills v-model="period" :options="periods" all-label="Любая дата" center /></div>
    </section>

    <section class="container-x">
      <!-- Афиша-постер: крупная дата слева, события дня справа -->
      <div v-if="grouped.length" class="card p-5 sm:p-10">
        <div class="mb-6 flex items-start justify-between gap-4 text-xs tracking-widest uppercase sm:mb-8">
          <span class="text-soft">Афиша<br />{{ city.name }}</span>
        </div>

        <div v-for="[date, items] in grouped" :key="date" class="grid gap-4 border-t border-line py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:gap-8">
          <h2 class="h-display text-[16vw] leading-[0.85] uppercase sm:text-8xl lg:text-9xl" :class="isWeekend(date) ? 'text-sand' : ''">
            {{ monthShort(date) }} {{ dayNumber(date) }}
          </h2>

          <div class="space-y-4 md:pt-2">
            <p class="text-xs tracking-widest uppercase" :class="isWeekend(date) ? 'text-accent-text' : 'text-muted'">{{ formatWeekdayLong(date) }}</p>
            <NuxtLink v-for="e in items" :key="e.id" :to="`/events/${e.id}`" class="group flex items-baseline justify-between gap-4">
              <div class="min-w-0">
                <p class="font-medium uppercase transition-colors group-hover:text-sand">{{ e.title }}</p>
                <p class="mt-0.5 text-xs tracking-wider text-muted uppercase">{{ getVenue(e.venue)?.name }} · {{ e.time }}</p>
              </div>
              <span class="shrink-0 text-sm tabular-nums">от {{ formatPrice(minPrice(e)) }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
      <UiEmpty v-else icon="calendar" title="Событий не найдено" text="Попробуйте выбрать другой жанр, дату или город.">
        <button
          class="btn-dark"
          @click="
            genre = '';
            period = '';
          "
        >
          Сбросить фильтры
        </button>
      </UiEmpty>
    </section>
  </div>
</template>

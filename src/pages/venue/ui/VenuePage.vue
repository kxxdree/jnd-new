<script setup lang="ts">
import { cityName } from "@entities/city";
import { events, isUpcoming } from "@entities/event";
import { formatName, getVenue } from "@entities/venue";
import { BookTableForm } from "@features/book-table";
import { FavoriteButton } from "@features/favorites";
import { ShareButton } from "@features/share";
import { genreName } from "@shared/config";
import { weekdayIndex } from "@shared/lib";
import { UiIcon, UiPhoto } from "@shared/ui";
import { EventCalendar } from "@widgets/event-calendar";
import VenueAbout from "./VenueAbout.vue";
import VenueGallery from "./VenueGallery.vue";
import VenueMenu from "./VenueMenu.vue";

const route = useRoute();
const found = getVenue(String(route.params.slug));
if (!found) throw createError({ statusCode: 404, message: "Заведение не найдено", fatal: true });
const v = found;

useHead({ title: `${v.name} - Joined`, meta: [{ name: "description", content: v.short }] });

const tabs = [
  { id: "schedule", name: "Афиша" },
  { id: "about", name: "О заведении" },
  { id: "menu", name: "Меню" },
  { id: "gallery", name: "Галерея" },
  { id: "booking", name: "Бронирование" },
  { id: "rules", name: "Правила" },
] as const;
type TabId = (typeof tabs)[number]["id"];
const tab = ref<TabId>(tabs.find((t) => t.id === route.query.tab)?.id ?? "schedule");
watch(tab, (t) => navigateTo({ query: { ...route.query, tab: t } }, { replace: true }));

const venueEvents = events.filter((e) => e.venue === v.slug && isUpcoming(e));
const todayIdx = weekdayIndex();
</script>

<template>
  <div>
    <section class="container-x pt-6">
      <NuxtLink to="/venues" class="btn-ghost mb-5 pl-3"><UiIcon name="chevron-left" :size="16" /> Все заведения</NuxtLink>

      <!-- Обложка -->
      <div class="grid gap-3 lg:grid-cols-[2fr_1fr]">
        <div class="card p-2">
          <UiPhoto :src="v.photo" :alt="v.name" class="aspect-4/3 rounded-[1.4rem] sm:aspect-video lg:aspect-auto lg:h-full lg:min-h-120">
            <div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-transparent" />
            <div class="absolute inset-x-0 bottom-0 p-5 sm:p-10">
              <div class="mb-4 flex flex-wrap gap-1.5">
                <span class="tag">{{ formatName(v.format) }}</span>
                <span v-for="g in v.genres" :key="g" class="tag tag-neutral">{{ genreName(g) }}</span>
              </div>
              <h1 class="h-display text-5xl sm:text-7xl lg:text-8xl">{{ v.name }}</h1>
              <p class="mt-3 max-w-xl text-white/85">{{ v.short }}</p>
            </div>
          </UiPhoto>
        </div>
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:grid-rows-2">
          <div class="card p-2"><UiPhoto :src="v.gallery[0]!" class="aspect-square h-full rounded-[1.4rem] lg:aspect-auto" /></div>
          <div class="card p-2"><UiPhoto :src="v.gallery[2]!" class="aspect-square h-full rounded-[1.4rem] lg:aspect-auto" /></div>
        </div>
      </div>

      <!-- Быстрые факты и действия -->
      <div class="mt-3 grid gap-3 lg:grid-cols-[2fr_1fr]">
        <div class="card grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 sm:p-6">
          <div>
            <p class="text-xs text-muted">Сегодня</p>
            <p class="mt-1 text-xl font-medium">{{ v.hours[todayIdx]!.time }}</p>
          </div>
          <div v-if="v.metro">
            <p class="text-xs text-muted">Метро</p>
            <p class="mt-1 text-xl font-medium">{{ v.metro }}</p>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <p class="text-xs text-muted">Адрес</p>
            <p class="mt-1 text-sm">{{ cityName(v.city) }}, {{ v.address }}</p>
          </div>
        </div>
        <div class="card flex items-center gap-2 p-3">
          <button class="btn-primary flex-1 py-3.5" @click="tab = 'booking'"><UiIcon name="calendar" :size="18" /> Забронировать</button>
          <FavoriteButton kind="venues" :id="v.slug" class="size-12" />
          <ShareButton :title="v.name" />
        </div>
      </div>
    </section>

    <!-- Вкладки: стеклянная плавающая лента -->
    <nav class="sticky top-22 z-30 mt-8 px-3 sm:top-24 sm:px-6">
      <div class="glass lg-refract mx-auto max-w-7xl rounded-full p-1.5 [--lg-refract-blur:16px]">
        <div class="scroll-x py-0">
          <button
            v-for="t in tabs"
            :key="t.id"
            class="pill"
            :class="tab === t.id ? 'pill-active' : 'bg-transparent shadow-none backdrop-blur-none before:hidden'"
            @click="tab = t.id"
          >
            {{ t.name }}
          </button>
        </div>
      </div>
    </nav>

    <section class="container-x pt-10">
      <div v-if="tab === 'schedule'">
        <h2 class="h-display mb-8 text-4xl sm:text-5xl">Музыкальный календарь</h2>
        <EventCalendar :events="venueEvents" />
      </div>

      <VenueAbout v-else-if="tab === 'about'" :venue="v" />
      <VenueMenu v-else-if="tab === 'menu'" :venue="v" />
      <VenueGallery v-else-if="tab === 'gallery'" :photos="v.gallery" />

      <div v-else-if="tab === 'booking'" class="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <BookTableForm :venue="v" />
        <div class="card h-fit p-6">
          <h3 class="mb-4 flex items-center gap-2 font-medium"><UiIcon name="info" class="text-accent-text" :size="18" /> Условия бронирования</h3>
          <ul class="space-y-3 text-sm text-soft">
            <li v-for="c in v.booking.conditions" :key="c" class="flex gap-3"><UiIcon name="check" :size="16" class="mt-0.5 text-accent-text" />{{ c }}</li>
          </ul>
        </div>
      </div>

      <div v-else-if="tab === 'rules'" class="max-w-3xl">
        <h2 class="h-display mb-8 text-4xl sm:text-5xl">Правила посещения</h2>
        <ol class="grid gap-3">
          <li v-for="(r, i) in v.rules" :key="r" class="card flex gap-5 p-5">
            <span class="text-liquid text-2xl font-medium">{{ String(i + 1).padStart(2, "0") }}</span>
            <p class="pt-1 text-soft">{{ r }}</p>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getArtist } from '@entities/artist'
import { cityName } from '@entities/city'
import { events, isUpcoming, minPrice } from '@entities/event'
import { getVenue } from '@entities/venue'
import { FavoriteButton } from '@features/favorites'
import { genreName } from '@shared/config'
import { dayNumber, formatPrice, formatWeekday, monthShort } from '@shared/lib'
import { UiEmpty, UiIcon, UiPhoto, UiSectionHead } from '@shared/ui'

const route = useRoute()
const found = getArtist(String(route.params.slug))
if (!found) throw createError({ statusCode: 404, message: 'Артист не найден', fatal: true })
const a = found

useHead({ title: `${a.name} - Joined`, meta: [{ name: 'description', content: a.short }] })

const own = events.filter(e => e.artists.includes(a.slug))
const upcoming = own.filter(isUpcoming).sort((x, y) => x.date.localeCompare(y.date))
const where = (venueSlug: string) => {
  const v = getVenue(venueSlug)
  return v ? `${v.name} · ${cityName(v.city)}` : ''
}
</script>

<template>
  <div>
    <!-- Карточка артиста: постер с именем + «паспорт» на чёрном -->
    <section class="container-x pt-6">
      <article class="rim relative overflow-hidden rounded-4xl bg-black">
        <!-- Постер -->
        <div class="relative aspect-4/5 sm:aspect-video lg:aspect-21/9">
          <UiPhoto :src="a.photo" :alt="a.name" class="absolute inset-0 h-full w-full" />
          <div class="pointer-events-none absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black" />

          <div class="absolute inset-0 grid place-items-center px-4">
            <h1 class="h-display text-center text-[13vw] font-bold lowercase sm:text-8xl lg:text-9xl">{{ a.name }}</h1>
          </div>
        </div>

        <!-- Об артисте -->
        <div class="grid gap-10 p-6 sm:p-10 md:grid-cols-[1fr_1.4fr] lg:p-14">
          <div class="flex flex-col justify-between gap-8">
            <h2 class="h-display text-3xl font-bold uppercase sm:text-4xl">Об артисте</h2>
            <p class="text-xs leading-relaxed text-muted">
              Город<br />
              <span class="text-white">{{ cityName(a.city) }}</span>
            </p>
          </div>

          <div>
            <dl class="space-y-6 text-sm leading-relaxed">
              <div class="grid gap-2 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt class="flex items-baseline gap-2 text-xs text-muted uppercase">Кратко<span class="flex-1 border-b border-dotted border-white/30" /></dt>
                <dd>{{ a.short }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt class="flex items-baseline gap-2 text-xs text-muted uppercase">Жанры<span class="flex-1 border-b border-dotted border-white/30" /></dt>
                <dd>{{ a.genres.map(genreName).join(', ') }}</dd>
              </div>
              <div class="grid gap-2 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt class="flex items-baseline gap-2 text-xs text-muted uppercase">Био<span class="flex-1 border-b border-dotted border-white/30" /></dt>
                <dd class="text-soft">{{ a.bio }}</dd>
              </div>
            </dl>

            <div class="mt-10 flex items-center gap-2">
              <FavoriteButton kind="artists" :id="a.slug" variant="label" />
              <a v-if="a.socials?.instagram" :href="a.socials.instagram" target="_blank" rel="noopener" class="btn-icon size-12" aria-label="Instagram">
                <UiIcon name="instagram" :size="20" />
              </a>
              <a v-if="a.socials?.telegram" :href="a.socials.telegram" target="_blank" rel="noopener" class="btn-icon size-12" aria-label="Telegram">
                <UiIcon name="telegram" :size="20" />
              </a>
            </div>
          </div>
        </div>
      </article>
    </section>

    <!-- Ближайшие выступления -->
    <section class="container-x mt-24">
      <UiSectionHead eyebrow="Туры" title="Ближайшие концерты" />
      <div v-if="upcoming.length" class="grid gap-3">
        <div v-for="e in upcoming" :key="e.id" class="card card-hover flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
          <div class="flex items-center gap-4 sm:w-56">
            <div class="glass-chip w-16 shrink-0 rounded-2xl py-2 text-center">
              <div class="text-3xl leading-none font-medium">{{ dayNumber(e.date) }}</div>
              <div class="mt-1 text-[11px] text-muted uppercase">{{ monthShort(e.date) }}, {{ formatWeekday(e.date) }}</div>
            </div>
            <div class="min-w-0 sm:hidden">
              <p class="font-medium">{{ e.title }}</p>
              <p class="text-sm text-muted">{{ where(e.venue) }}</p>
            </div>
          </div>
          <div class="hidden min-w-0 flex-1 sm:block">
            <p class="truncate font-medium">{{ e.title }}</p>
            <p class="truncate text-sm text-muted">{{ where(e.venue) }} · {{ e.time }}</p>
          </div>
          <NuxtLink :to="`/events/${e.id}`" class="btn-primary shrink-0">Билеты от {{ formatPrice(minPrice(e)) }}</NuxtLink>
        </div>
      </div>
      <UiEmpty v-else icon="calendar" title="Концертов пока нет" text="Новые даты появятся здесь, как только артист их объявит." />
    </section>
  </div>
</template>

<script setup lang="ts">
import { getArtist } from '@entities/artist'
import { cityName } from '@entities/city'
import { getEvent } from '@entities/event'
import { getVenue } from '@entities/venue'
import { TicketPurchase } from '@features/buy-ticket'
import { genreName } from '@shared/config'
import { formatDay, formatWeekdayLong } from '@shared/lib'
import { UiIcon, UiPhoto } from '@shared/ui'

const route = useRoute()
const found = getEvent(String(route.params.id))
if (!found) throw createError({ statusCode: 404, message: 'Событие не найдено', fatal: true })
const ev = found
const venue = getVenue(ev.venue)!
const lineup = ev.artists.map(getArtist).filter(a => !!a)

useHead({ title: `${ev.title} - Joined`, meta: [{ name: 'description', content: ev.description }] })
</script>

<template>
  <section class="container-x pt-6">
    <NuxtLink to="/events" class="btn-ghost mb-5 pl-3"><UiIcon name="chevron-left" :size="16" /> Афиша</NuxtLink>

    <div class="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <div class="grid gap-4">
        <div class="card p-2">
          <UiPhoto :src="ev.photo" :alt="ev.title" class="aspect-4/3 rounded-[1.4rem] sm:aspect-video">
            <div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
            <div class="absolute inset-x-0 bottom-0 p-5 sm:p-10">
              <div class="mb-4 flex flex-wrap gap-1.5">
                <span v-for="g in ev.genres" :key="g" class="tag">{{ genreName(g) }}</span>
              </div>
              <h1 class="h-display text-4xl sm:text-6xl lg:text-7xl">{{ ev.title }}</h1>
            </div>
          </UiPhoto>
        </div>

        <div class="card grid grid-cols-1 gap-5 p-6 sm:grid-cols-3">
          <div class="flex items-start gap-3">
            <UiIcon name="calendar" :size="20" class="mt-0.5 shrink-0 text-accent-text" />
            <div>
              <p class="font-medium">{{ formatDay(ev.date) }}</p>
              <p class="text-sm text-muted capitalize">{{ formatWeekdayLong(ev.date) }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <UiIcon name="clock" :size="20" class="mt-0.5 shrink-0 text-accent-text" />
            <div>
              <p class="font-medium">Начало в {{ ev.time }}</p>
              <p class="text-sm text-muted">открытие дверей за час</p>
            </div>
          </div>
          <NuxtLink :to="`/venues/${venue.slug}`" class="group flex items-start gap-3">
            <UiIcon name="pin" :size="20" class="mt-0.5 shrink-0 text-accent-text" />
            <div>
              <p class="font-medium group-hover:text-sand">{{ venue.name }}</p>
              <p class="text-sm text-muted">{{ venue.address }}</p>
            </div>
          </NuxtLink>
        </div>

        <div class="card p-6 sm:p-8">
          <h2 class="mb-3 text-2xl font-medium">О событии</h2>
          <p class="leading-relaxed text-soft">{{ ev.description }}</p>
        </div>

        <!-- Лайнап списком, как события на странице «Афиша» -->
        <div v-if="lineup.length" class="card p-6 sm:p-8">
          <h2 class="mb-5 text-2xl font-medium">Лайнап</h2>
          <NuxtLink v-for="a in lineup" :key="a!.slug" :to="`/artists/${a!.slug}`" class="group flex items-center gap-4 border-t border-line py-4 last:pb-0">
            <UiPhoto :src="a!.photo" :alt="a!.name" class="size-14 shrink-0 rounded-lg" />
            <div class="min-w-0 flex-1">
              <p class="font-medium uppercase transition-colors group-hover:text-sand">{{ a!.name }}</p>
              <p class="mt-0.5 text-xs tracking-wider text-muted uppercase">{{ cityName(a!.city) }} · {{ a!.genres.map(genreName).join(', ') }}</p>
            </div>          </NuxtLink>
        </div>
      </div>

      <aside class="lg:sticky lg:top-28 lg:h-fit">
        <TicketPurchase :event="ev" :venue-name="venue.name" />
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getArtist } from '@entities/artist'
import { cityName } from '@entities/city'
import { events, isUpcoming, minPrice } from '@entities/event'
import { getVenue } from '@entities/venue'
import { FavoriteButton, FollowButton, useFavorites } from '@features/favorites'
import { genreName } from '@shared/config'
import { compact, dayNumber, formatDate, formatPrice, formatWeekday, monthShort, useToast } from '@shared/lib'
import { UiEmpty, UiIcon, UiPhoto, UiSectionHead } from '@shared/ui'

const route = useRoute()
const found = getArtist(String(route.params.slug))
if (!found) throw createError({ statusCode: 404, message: 'Артист не найден', fatal: true })
const a = found

useHead({ title: `${a.name} - Joined`, meta: [{ name: 'description', content: a.short }] })

const { has } = useFavorites()
const { push } = useToast()

const own = events.filter(e => e.artists.includes(a.slug))
const upcoming = own.filter(isUpcoming).sort((x, y) => x.date.localeCompare(y.date))
const past = own.filter(e => !isUpcoming(e)).sort((x, y) => y.date.localeCompare(x.date))
const where = (venueSlug: string) => {
  const v = getVenue(venueSlug)
  return v ? `${v.name} · ${cityName(v.city)}` : ''
}

const followers = computed(() => a.followers + (has('follows', a.slug) ? 1 : 0))
const playing = ref<string | null>(null)
const play = (title: string) => {
  playing.value = playing.value === title ? null : title
  if (playing.value) push(`Воспроизведение: ${title} (демо)`)
}
</script>

<template>
  <div>
    <section class="container-x pt-6">
      <NuxtLink to="/artists" class="btn-ghost mb-5 pl-3"><UiIcon name="chevron-left" :size="16" /> Все артисты</NuxtLink>

      <div class="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div class="card p-2"><UiPhoto :src="a.photo" :alt="a.name" class="aspect-square rounded-[1.4rem]" /></div>
        <div class="card flex flex-col p-6 sm:p-10">
          <div class="mb-5 flex flex-wrap gap-1.5">
            <span v-for="g in a.genres" :key="g" class="tag">{{ genreName(g) }}</span>
          </div>
          <h1 class="h-display text-5xl sm:text-7xl">{{ a.name }}</h1>
          <p class="mt-4 text-lg text-soft">{{ a.short }}</p>

          <dl class="glass-chip mt-8 grid grid-cols-3 gap-4 rounded-3xl p-5">
            <div><dt class="text-xs text-muted">Город</dt><dd class="mt-1 font-medium">{{ cityName(a.city) }}</dd></div>
            <div><dt class="text-xs text-muted">С нами с</dt><dd class="mt-1 font-medium">{{ a.founded }}</dd></div>
            <div><dt class="text-xs text-muted">Подписчики</dt><dd class="mt-1 font-medium">{{ compact(followers) }}</dd></div>
          </dl>

          <p class="mt-6 leading-relaxed text-soft">{{ a.bio }}</p>

          <div class="mt-auto flex flex-col gap-2 pt-8 sm:flex-row">
            <FollowButton :artist="a.slug" />
            <FavoriteButton kind="artists" :id="a.slug" variant="label" />
          </div>
        </div>
      </div>
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
      <UiEmpty v-else icon="calendar" title="Концертов пока нет" text="Подпишитесь, чтобы узнать о новых датах первыми." />
    </section>

    <!-- Состав -->
    <section class="container-x mt-24">
      <UiSectionHead eyebrow="Состав" title="Участники" />
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <div v-for="(m, i) in a.members" :key="m.name" class="card p-5">
          <div class="mb-6 grid size-12 place-items-center rounded-full text-lg font-medium" :class="i === 0 ? 'pill-active' : 'glass-chip'">{{ m.name[0] }}</div>
          <p class="font-medium">{{ m.name }}</p>
          <p class="mt-1 text-sm text-muted">{{ m.role }}</p>
        </div>
      </div>
    </section>

    <!-- Дискография + видео -->
    <section class="container-x mt-24 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <UiSectionHead eyebrow="Дискография" title="Треки" />
        <ol class="card divide-y divide-line p-2">
          <li v-for="(t, i) in a.tracks" :key="t.title" class="flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-white/5">
            <button
              class="size-10"
              :class="playing === t.title ? 'pill-active grid place-items-center rounded-full' : 'btn-icon'"
              :aria-label="`Воспроизвести ${t.title}`"
              @click="play(t.title)"
            >
              <UiIcon :name="playing === t.title ? 'minus' : 'play'" :size="16" filled />
            </button>
            <span class="w-5 text-sm text-muted">{{ i + 1 }}</span>
            <div class="min-w-0 flex-1">
              <p class="truncate font-medium" :class="playing === t.title ? 'text-sand' : ''">{{ t.title }}</p>
              <p class="truncate text-sm text-muted">{{ t.album }} · {{ t.year }}</p>
            </div>
            <span class="text-sm text-muted">{{ t.duration }}</span>
          </li>
        </ol>
      </div>
      <div>
        <UiSectionHead eyebrow="Live" title="Видео" />
        <div class="grid gap-4">
          <button v-for="vd in a.videos" :key="vd.title" class="card card-hover group p-2 text-left" @click="push('Видео откроется в плеере (демо)')">
            <UiPhoto :src="vd.photo" class="aspect-video rounded-[1.3rem]">
              <div class="absolute inset-0 grid place-items-center">
                <span class="glass-chip grid size-16 place-items-center rounded-full transition-transform duration-500 ease-[var(--ease-liquid)] group-hover:scale-110">
                  <UiIcon name="play" filled :size="24" />
                </span>
              </div>
              <span class="glass-chip absolute right-3 bottom-3 rounded-full px-2.5 py-0.5 text-xs">{{ vd.duration }}</span>
            </UiPhoto>
            <p class="px-3 pt-3 pb-1 font-medium">{{ vd.title }}</p>
          </button>
        </div>
      </div>
    </section>

    <!-- Прошедшие -->
    <section v-if="past.length" class="container-x mt-24">
      <UiSectionHead eyebrow="Архив" title="Прошедшие выступления" />
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="e in past" :key="e.id" class="card flex items-center gap-4 p-2 pr-4">
          <UiPhoto :src="e.photo" class="size-16 shrink-0 rounded-2xl opacity-70 grayscale" />
          <div class="min-w-0">
            <p class="truncate font-medium">{{ e.title }}</p>
            <p class="text-sm text-muted">{{ formatDate(e.date) }} · {{ getVenue(e.venue)?.name }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

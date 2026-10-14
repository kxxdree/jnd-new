<script setup lang="ts">
import { cityName, events, genreName, getArtist, getVenue, isUpcoming, minPrice } from '~/data/catalog'

const route = useRoute()
const found = getArtist(String(route.params.slug))
if (!found) throw createError({ statusCode: 404, message: 'Артист не найден', fatal: true })
const a = found

useHead({ title: `${a.name} — Joined`, meta: [{ name: 'description', content: a.short }] })

const { has, toggle } = useFavorites()
const { push } = useToast()

const own = events.filter(e => e.artists.includes(a.slug))
const upcoming = own.filter(isUpcoming).sort((x, y) => x.date.localeCompare(y.date))
const past = own.filter(e => !isUpcoming(e)).sort((x, y) => y.date.localeCompare(x.date))

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
      <NuxtLink to="/artists" class="mb-5 inline-flex items-center gap-1 text-sm text-muted hover:text-white">
        <AppIcon name="chevron-left" :size="16" /> Все артисты
      </NuxtLink>

      <div class="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
        <PhotoImg :src="a.photo" :alt="a.name" class="aspect-square rounded-4xl" />
        <div class="card flex flex-col p-6 sm:p-10">
          <div class="mb-5 flex flex-wrap gap-1.5">
            <span v-for="g in a.genres" :key="g" class="tag">{{ genreName(g) }}</span>
          </div>
          <h1 class="h-display text-5xl sm:text-7xl">{{ a.name }}</h1>
          <p class="mt-4 text-lg text-soft">{{ a.short }}</p>

          <dl class="mt-8 grid grid-cols-3 gap-4 border-y border-line py-6">
            <div><dt class="text-xs text-muted">Город</dt><dd class="mt-1 font-medium">{{ cityName(a.city) }}</dd></div>
            <div><dt class="text-xs text-muted">С нами с</dt><dd class="mt-1 font-medium">{{ a.founded }}</dd></div>
            <div><dt class="text-xs text-muted">Подписчики</dt><dd class="mt-1 font-medium">{{ compact(followers) }}</dd></div>
          </dl>

          <p class="mt-6 leading-relaxed text-soft">{{ a.bio }}</p>

          <div class="mt-auto flex flex-col gap-2 pt-8 sm:flex-row">
            <button class="flex-1 py-3.5" :class="has('follows', a.slug) ? 'btn-dark' : 'btn-primary'" @click="toggle('follows', a.slug)">
              <AppIcon :name="has('follows', a.slug) ? 'check' : 'bell'" :size="18" />
              {{ has('follows', a.slug) ? 'Вы подписаны' : 'Подписаться на обновления' }}
            </button>
            <button
              class="btn-dark py-3.5"
              :class="has('artists', a.slug) ? 'text-accent' : ''"
              @click="toggle('artists', a.slug)"
            >
              <AppIcon name="heart" :filled="has('artists', a.slug)" :size="18" /> В избранное
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Ближайшие выступления -->
    <section class="container-x mt-20">
      <SectionHead title="Ближайшие концерты" />
      <div v-if="upcoming.length" class="grid gap-2">
        <div v-for="e in upcoming" :key="e.id" class="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
          <div class="flex items-center gap-4 sm:w-56">
            <div class="w-14 shrink-0 text-center">
              <div class="text-3xl leading-none font-medium">{{ dayNumber(e.date) }}</div>
              <div class="mt-1 text-xs text-muted uppercase">{{ monthShort(e.date) }}, {{ formatWeekday(e.date) }}</div>
            </div>
            <div class="sm:hidden">
              <p class="font-medium">{{ e.title }}</p>
              <p class="text-sm text-muted">{{ getVenue(e.venue)?.name }} · {{ cityName(getVenue(e.venue)!.city) }}</p>
            </div>
          </div>
          <div class="hidden min-w-0 flex-1 sm:block">
            <p class="truncate font-medium">{{ e.title }}</p>
            <p class="truncate text-sm text-muted">{{ getVenue(e.venue)?.name }} · {{ cityName(getVenue(e.venue)!.city) }} · {{ e.time }}</p>
          </div>
          <NuxtLink :to="`/events/${e.id}`" class="btn-primary shrink-0">Билеты от {{ formatPrice(minPrice(e)) }}</NuxtLink>
        </div>
      </div>
      <EmptyState v-else icon="calendar" title="Концертов пока нет" text="Подпишитесь, чтобы узнать о новых датах первыми." />
    </section>

    <!-- Состав -->
    <section class="container-x mt-20">
      <SectionHead title="Участники" />
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <div v-for="(m, i) in a.members" :key="m.name" class="card p-5">
          <div class="mb-6 grid size-12 place-items-center rounded-full text-lg font-medium" :class="i === 0 ? 'bg-accent' : 'bg-card-2'">{{ m.name[0] }}</div>
          <p class="font-medium">{{ m.name }}</p>
          <p class="mt-1 text-sm text-muted">{{ m.role }}</p>
        </div>
      </div>
    </section>

    <!-- Дискография + видео -->
    <section class="container-x mt-20 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <SectionHead title="Треки" />
        <ol class="card divide-y divide-line">
          <li v-for="(t, i) in a.tracks" :key="t.title" class="flex items-center gap-4 px-4 py-3 sm:px-5">
            <button
              class="grid size-10 shrink-0 place-items-center rounded-full transition-colors"
              :class="playing === t.title ? 'bg-accent' : 'bg-card-2 hover:bg-card-3'"
              :aria-label="`Воспроизвести ${t.title}`"
              @click="play(t.title)"
            >
              <AppIcon :name="playing === t.title ? 'minus' : 'play'" :size="16" filled />
            </button>
            <span class="w-5 text-sm text-muted">{{ i + 1 }}</span>
            <div class="min-w-0 flex-1">
              <p class="truncate font-medium" :class="playing === t.title ? 'text-accent-text' : ''">{{ t.title }}</p>
              <p class="truncate text-sm text-muted">{{ t.album }} · {{ t.year }}</p>
            </div>
            <span class="text-sm text-muted">{{ t.duration }}</span>
          </li>
        </ol>
      </div>
      <div>
        <SectionHead title="Видео" />
        <div class="grid gap-3">
          <button v-for="vd in a.videos" :key="vd.title" class="group text-left" @click="push('Видео откроется в плеере (демо)')">
            <PhotoImg :src="vd.photo" class="aspect-video rounded-card">
              <div class="absolute inset-0 grid place-items-center">
                <span class="grid size-14 place-items-center rounded-full bg-black/60 backdrop-blur transition-transform group-hover:scale-110">
                  <AppIcon name="play" filled :size="22" />
                </span>
              </div>
              <span class="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-0.5 text-xs">{{ vd.duration }}</span>
            </PhotoImg>
            <p class="mt-2 font-medium">{{ vd.title }}</p>
          </button>
        </div>
      </div>
    </section>

    <!-- Прошедшие -->
    <section v-if="past.length" class="container-x mt-20">
      <SectionHead title="Прошедшие выступления" />
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="e in past" :key="e.id" class="card flex items-center gap-4 p-3 opacity-80">
          <PhotoImg :src="e.photo" class="size-16 shrink-0 rounded-xl grayscale" />
          <div class="min-w-0">
            <p class="truncate font-medium">{{ e.title }}</p>
            <p class="text-sm text-muted">{{ formatDate(e.date) }} · {{ getVenue(e.venue)?.name }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

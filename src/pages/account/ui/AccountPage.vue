<script setup lang="ts">
import { artists } from '@entities/artist'
import { useBookings } from '@entities/booking'
import { events, getEvent } from '@entities/event'
import { roleNames, useSession } from '@entities/session'
import { ticketTypeNames, useTickets } from '@entities/ticket'
import { getVenue, VenueCard, venues } from '@entities/venue'
import { FavoriteButton, useFavorites } from '@features/favorites'
import { RefundTicketButton } from '@features/refund-ticket'
import { formatDate, formatDay, formatPrice, plural, todayISO, useToast } from '@shared/lib'
import { UiEmpty, UiIcon, UiModal, UiPhoto, UiQr, UiTabs } from '@shared/ui'

useHead({ title: 'Личный кабинет - Joined' })

const route = useRoute()
const { user, logout } = useSession()
const { tickets, active } = useTickets()
const { bookings, confirmed, cancel } = useBookings()
const { favs, toggle } = useFavorites()
const { push } = useToast()

type Tab = 'tickets' | 'bookings' | 'history' | 'favorites'
const tabs = computed(() => [
  { id: 'tickets' as Tab, name: 'Мои билеты', icon: 'ticket', badge: active.value.length },
  { id: 'bookings' as Tab, name: 'Бронирования', icon: 'calendar', badge: confirmed.value.length },
  { id: 'history' as Tab, name: 'История посещений', icon: 'clock' },
  { id: 'favorites' as Tab, name: 'Избранное', icon: 'heart' },
])
const tab = ref<Tab>(tabs.value.some(t => t.id === route.query.tab) ? (route.query.tab as Tab) : 'tickets')
watch(tab, t => navigateTo({ query: { tab: t } }, { replace: true }))

// --- QR билета
const qrTicket = ref<string | null>(null)
const qrOpen = computed({ get: () => !!qrTicket.value, set: (v) => { if (!v) qrTicket.value = null } })
const qrEvent = computed(() => {
  const t = tickets.value.find(x => x.id === qrTicket.value)
  return t ? getEvent(t.eventId) : undefined
})

// --- История (демо: прошедшие события + наши брони в прошлом)
const history = computed(() => [
  ...events.filter(e => e.id.startsWith('p')).map(e => ({ id: e.id, title: e.title, date: e.date, venue: e.venue, kind: 'Концерт' })),
  ...bookings.value.filter(b => b.date < todayISO()).map(b => ({ id: b.id, title: `Бронь на ${b.guests}`, date: b.date, venue: b.venue, kind: 'Бронь' })),
].sort((a, b) => b.date.localeCompare(a.date)))

// --- Избранное
const favVenues = computed(() => venues.filter(v => favs.value.venues.includes(v.slug)))
const favArtists = computed(() => artists.filter(a => favs.value.artists.includes(a.slug)))
</script>

<template>
  <section class="container-x pt-10">
    <!-- Шапка профиля -->
    <div class="card mb-8 flex flex-wrap items-center gap-5 p-5 sm:p-8">
      <div class="grid size-20 place-items-center rounded-full bg-accent text-3xl font-semibold uppercase">{{ user?.name[0] }}</div>
      <div class="min-w-0 flex-1">
        <h1 class="h-display truncate text-4xl sm:text-6xl">{{ user?.name }}</h1>
        <p class="mt-1 text-muted">{{ user?.email }} · {{ user ? roleNames[user.role] : '' }}</p>
      </div>
      <button class="btn-dark" @click="logout()"><UiIcon name="logout" :size="18" /> Выйти</button>
    </div>

    <div class="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside class="lg:sticky lg:top-28 lg:h-fit"><UiTabs v-model="tab" :tabs="tabs" /></aside>

      <div class="min-w-0">
        <!-- БИЛЕТЫ -->
        <div v-if="tab === 'tickets'" class="grid gap-4">
          <template v-if="tickets.length">
            <article
              v-for="t in tickets"
              :key="t.id"
              class="card flex flex-col overflow-hidden p-2 sm:flex-row"
              :class="t.status === 'refunded' ? 'opacity-50' : ''"
            >
              <UiPhoto :src="getEvent(t.eventId)!.photo" class="h-36 rounded-[1.3rem] sm:h-auto sm:w-48 sm:shrink-0" />
              <!-- «отрывная» линия билета -->
              <div class="mx-3 hidden border-l-2 border-dashed border-white/15 sm:block" />
              <div class="flex flex-1 flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div class="min-w-0 flex-1">
                  <div class="mb-2 flex flex-wrap gap-1.5">
                    <span class="tag">{{ ticketTypeNames[t.type] }} × {{ t.qty }}</span>
                    <span v-if="t.status === 'refunded'" class="tag tag-neutral">Возвращён</span>
                  </div>
                  <NuxtLink :to="`/events/${t.eventId}`" class="text-lg font-medium hover:text-sand">{{ getEvent(t.eventId)!.title }}</NuxtLink>
                  <p class="mt-1 text-sm text-muted">
                    {{ formatDay(getEvent(t.eventId)!.date) }}, {{ getEvent(t.eventId)!.time }} · {{ getVenue(getEvent(t.eventId)!.venue)?.name }}
                  </p>
                  <p class="mt-1 text-xs text-muted">№ {{ t.id }} · {{ formatPrice(t.total) }}</p>
                </div>
                <div v-if="t.status === 'active'" class="flex gap-2 sm:flex-col">
                  <button class="btn-primary flex-1" @click="qrTicket = t.id"><UiIcon name="qr" :size="16" /> QR-код</button>
                  <RefundTicketButton :ticket-id="t.id" />
                </div>
              </div>
            </article>
          </template>
          <UiEmpty v-else icon="ticket" title="Билетов пока нет" text="Найдите концерт по душе - билеты появятся здесь вместе с QR-кодом.">
            <NuxtLink to="/events" class="btn-primary">Открыть афишу</NuxtLink>
          </UiEmpty>
        </div>

        <!-- БРОНИРОВАНИЯ -->
        <div v-else-if="tab === 'bookings'" class="grid gap-4">
          <template v-if="bookings.length">
            <article v-for="b in bookings" :key="b.id" class="card flex flex-col gap-4 p-3 pr-5 sm:flex-row sm:items-center" :class="b.status === 'cancelled' ? 'opacity-50' : ''">
              <UiPhoto :src="getVenue(b.venue)!.photo" class="size-16 shrink-0 rounded-2xl" />
              <div class="min-w-0 flex-1">
                <NuxtLink :to="`/venues/${b.venue}`" class="text-lg font-medium hover:text-sand">{{ getVenue(b.venue)!.name }}</NuxtLink>
                <p class="text-sm text-muted">{{ formatDay(b.date) }}, {{ b.time }} · {{ b.guests }} {{ plural(b.guests, ['гость', 'гостя', 'гостей']) }} · депозит {{ formatPrice(b.deposit) }}</p>
                <p class="mt-1 text-xs" :class="b.status === 'confirmed' ? 'text-accent-text' : 'text-muted'">
                  {{ b.status === 'confirmed' ? 'Подтверждено' : 'Отменено' }} · № {{ b.id }}
                </p>
              </div>
              <button v-if="b.status === 'confirmed'" class="btn-dark" @click="cancel(b.id); push('Бронь отменена, депозит будет возвращён')">Отменить</button>
            </article>
          </template>
          <UiEmpty v-else icon="calendar" title="Нет бронирований" text="Забронируйте столик на странице любого бара.">
            <NuxtLink to="/venues" class="btn-primary">Выбрать бар</NuxtLink>
          </UiEmpty>
        </div>

        <!-- ИСТОРИЯ -->
        <div v-else-if="tab === 'history'" class="card p-6 sm:p-8">
          <ol class="relative border-l border-white/15 pl-7">
            <li v-for="h in history" :key="h.id" class="relative pb-8 last:pb-0">
              <span class="absolute top-1 -left-[34px] size-3 rounded-full bg-accent shadow-[0_0_0_4px_rgb(255_77_0/0.25),0_0_12px_#ff4d00]" />
              <p class="text-xs text-muted">{{ formatDate(h.date) }} · {{ h.kind }}</p>
              <p class="mt-1 text-lg font-medium">{{ h.title }}</p>
              <NuxtLink :to="`/venues/${h.venue}`" class="mt-1 inline-flex items-center gap-1 text-sm text-soft hover:text-sand">
                {{ getVenue(h.venue)?.name }} <UiIcon name="arrow-right" :size="14" />
              </NuxtLink>
            </li>
          </ol>
        </div>

        <!-- ИЗБРАННОЕ -->
        <div v-else-if="tab === 'favorites'" class="grid gap-10">
          <div>
            <h2 class="mb-4 text-2xl font-medium">Заведения</h2>
            <div v-if="favVenues.length" class="grid sm:grid-cols-2 xl:grid-cols-3">
              <VenueCard v-for="v in favVenues" :key="v.slug" :venue="v">
                <template #actions><FavoriteButton kind="venues" :id="v.slug" /></template>
              </VenueCard>
            </div>
            <p v-else class="card p-5 text-sm text-muted">Нажмите ♥ на карточке бара, чтобы сохранить его здесь.</p>
          </div>
          <div>
            <h2 class="mb-4 text-2xl font-medium">Артисты</h2>
            <div v-if="favArtists.length" class="grid gap-3">
              <div v-for="a in favArtists" :key="a.slug" class="card flex items-center gap-4 p-2 pr-4">
                <UiPhoto :src="a.photo" class="size-14 shrink-0 rounded-2xl" />
                <NuxtLink :to="`/artists/${a.slug}`" class="min-w-0 flex-1">
                  <p class="truncate font-medium hover:text-sand">{{ a.name }}</p>
                  <p class="text-xs text-muted">В избранном</p>
                </NuxtLink>
                <button class="btn-dark" @click="toggle('artists', a.slug)">Убрать</button>
              </div>
            </div>
            <p v-else class="card p-5 text-sm text-muted">Добавьте артиста в избранное на его странице, чтобы сохранить его здесь.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- QR -->
    <UiModal v-model="qrOpen" title="Электронный билет">
      <div v-if="qrTicket" class="flex flex-col items-center text-center">
        <UiQr :value="`JOINED:${qrTicket}`" :size="240" />
        <p class="mt-6 text-lg font-medium">{{ qrEvent?.title }}</p>
        <p class="mt-1 text-sm text-muted">Покажите код на входе · № {{ qrTicket }}</p>
      </div>
    </UiModal>
  </section>
</template>

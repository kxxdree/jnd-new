<script setup lang="ts">
import { artists, events, getEvent, getVenue, venues } from '~/data/catalog'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Личный кабинет — Joined' })

const route = useRoute()
const { user, logout } = useAuth()
const { tickets, bookings, myReviews, refund, cancelBooking } = useTickets()
const { favs, toggle } = useFavorites()
const { push } = useToast()

type Tab = 'tickets' | 'bookings' | 'history' | 'favorites' | 'reviews' | 'notifications'
const activeTickets = computed(() => tickets.value.filter(t => t.status === 'active'))
const tabs = computed(() => [
  { id: 'tickets' as Tab, name: 'Мои билеты', icon: 'ticket', badge: activeTickets.value.length },
  { id: 'bookings' as Tab, name: 'Бронирования', icon: 'calendar', badge: bookings.value.filter(b => b.status === 'confirmed').length },
  { id: 'history' as Tab, name: 'История посещений', icon: 'clock' },
  { id: 'favorites' as Tab, name: 'Избранное', icon: 'heart' },
  { id: 'reviews' as Tab, name: 'Отзывы и оценки', icon: 'star' },
  { id: 'notifications' as Tab, name: 'Уведомления', icon: 'bell' },
])
const tab = ref<Tab>((route.query.tab as Tab) || 'tickets')
watch(tab, t => navigateTo({ query: { tab: t } }, { replace: true }))

// --- Билеты
const typeNames = { standard: 'Стандарт', vip: 'VIP', table: 'Столик' }
const qrTicket = ref<string | null>(null)
const qrOpen = computed({ get: () => !!qrTicket.value, set: (v) => { if (!v) qrTicket.value = null } })
const refundId = ref<string | null>(null)
const refundOpen = computed({ get: () => !!refundId.value, set: (v) => { if (!v) refundId.value = null } })
const confirmRefund = () => {
  refund(refundId.value!)
  refundId.value = null
  push('Возврат оформлен. Деньги вернутся в течение 3–5 дней')
}

// --- История (демо: прошедшие события + наши брони в прошлом)
const history = computed(() => [
  ...events.filter(e => e.id.startsWith('p')).map(e => ({ id: e.id, title: e.title, date: e.date, venue: e.venue, kind: 'Концерт' })),
  ...bookings.value.filter(b => b.date < new Date().toISOString().slice(0, 10)).map(b => ({ id: b.id, title: `Бронь на ${b.guests}`, date: b.date, venue: b.venue, kind: 'Бронь' })),
].sort((a, b) => b.date.localeCompare(a.date)))

// --- Избранное
const favVenues = computed(() => venues.filter(v => favs.value.venues.includes(v.slug)))
const favArtists = computed(() => artists.filter(a => favs.value.artists.includes(a.slug) || favs.value.follows.includes(a.slug)))

// --- Уведомления
const notify = usePersisted('joined_notify', () => ({
  reminders: true,
  artists: true,
  venues: false,
  digest: true,
  email: true,
  push: false,
}))
</script>

<template>
  <section class="container-x pt-10">
    <!-- Шапка профиля -->
    <div class="mb-10 flex flex-wrap items-center gap-5">
      <div class="grid size-20 place-items-center rounded-full bg-accent text-3xl font-semibold uppercase">{{ user?.name[0] }}</div>
      <div class="min-w-0 flex-1">
        <h1 class="h-display truncate text-4xl sm:text-6xl">{{ user?.name }}</h1>
        <p class="mt-1 text-muted">{{ user?.email }} · {{ roleNames[user!.role] }}</p>
      </div>
      <button class="btn-ghost" @click="logout()"><AppIcon name="logout" :size="18" /> Выйти</button>
    </div>

    <div class="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside class="lg:sticky lg:top-24 lg:h-fit">
        <DashTabs v-model="tab" :tabs="tabs" />
      </aside>

      <div class="min-w-0">
        <!-- БИЛЕТЫ -->
        <div v-if="tab === 'tickets'" class="grid gap-3">
          <template v-if="tickets.length">
            <article
              v-for="t in tickets"
              :key="t.id"
              class="card flex flex-col overflow-hidden sm:flex-row"
              :class="t.status === 'refunded' ? 'opacity-50' : ''"
            >
              <PhotoImg :src="getEvent(t.eventId)!.photo" class="h-36 sm:h-auto sm:w-48 sm:shrink-0" />
              <div class="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div class="min-w-0 flex-1">
                  <div class="mb-2 flex flex-wrap gap-1.5">
                    <span class="tag">{{ typeNames[t.type] }} × {{ t.qty }}</span>
                    <span v-if="t.status === 'refunded'" class="tag border-line bg-card-2 text-muted">Возвращён</span>
                  </div>
                  <NuxtLink :to="`/events/${t.eventId}`" class="text-lg font-medium hover:text-accent-text">{{ getEvent(t.eventId)!.title }}</NuxtLink>
                  <p class="mt-1 text-sm text-muted">
                    {{ formatDay(getEvent(t.eventId)!.date) }}, {{ getEvent(t.eventId)!.time }} · {{ getVenue(getEvent(t.eventId)!.venue)!.name }}
                  </p>
                  <p class="mt-1 text-xs text-muted">№ {{ t.id }} · {{ formatPrice(t.total) }}</p>
                </div>
                <div v-if="t.status === 'active'" class="flex gap-2 sm:flex-col">
                  <button class="btn-primary flex-1" @click="qrTicket = t.id"><AppIcon name="qr" :size="16" /> QR-код</button>
                  <button class="btn-dark flex-1" @click="refundId = t.id">Вернуть</button>
                </div>
              </div>
            </article>
          </template>
          <EmptyState v-else icon="ticket" title="Билетов пока нет" text="Найдите концерт по душе — билеты появятся здесь вместе с QR-кодом.">
            <NuxtLink to="/events" class="btn-primary">Открыть афишу</NuxtLink>
          </EmptyState>
        </div>

        <!-- БРОНИРОВАНИЯ -->
        <div v-else-if="tab === 'bookings'" class="grid gap-3">
          <template v-if="bookings.length">
            <article v-for="b in bookings" :key="b.id" class="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center" :class="b.status === 'cancelled' ? 'opacity-50' : ''">
              <PhotoImg :src="getVenue(b.venue)!.photo" class="size-16 shrink-0 rounded-xl" />
              <div class="min-w-0 flex-1">
                <NuxtLink :to="`/venues/${b.venue}`" class="text-lg font-medium hover:text-accent-text">{{ getVenue(b.venue)!.name }}</NuxtLink>
                <p class="text-sm text-muted">{{ formatDay(b.date) }}, {{ b.time }} · {{ b.guests }} {{ plural(b.guests, ['гость', 'гостя', 'гостей']) }} · депозит {{ formatPrice(b.deposit) }}</p>
                <p class="mt-1 text-xs" :class="b.status === 'confirmed' ? 'text-accent-text' : 'text-muted'">
                  {{ b.status === 'confirmed' ? 'Подтверждено' : 'Отменено' }} · № {{ b.id }}
                </p>
              </div>
              <button v-if="b.status === 'confirmed'" class="btn-dark" @click="cancelBooking(b.id); push('Бронь отменена, депозит будет возвращён')">Отменить</button>
            </article>
          </template>
          <EmptyState v-else icon="calendar" title="Нет бронирований" text="Забронируйте столик на странице любого бара.">
            <NuxtLink to="/venues" class="btn-primary">Выбрать бар</NuxtLink>
          </EmptyState>
        </div>

        <!-- ИСТОРИЯ -->
        <div v-else-if="tab === 'history'">
          <ol class="relative border-l border-line pl-6">
            <li v-for="h in history" :key="h.id" class="relative pb-8 last:pb-0">
              <span class="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-accent ring-4 ring-ink" />
              <p class="text-xs text-muted">{{ formatDate(h.date) }} · {{ h.kind }}</p>
              <p class="mt-1 text-lg font-medium">{{ h.title }}</p>
              <NuxtLink :to="`/venues/${h.venue}?tab=reviews`" class="mt-1 inline-flex items-center gap-1 text-sm text-soft hover:text-accent-text">
                {{ getVenue(h.venue)!.name }} — оставить отзыв <AppIcon name="arrow-right" :size="14" />
              </NuxtLink>
            </li>
          </ol>
        </div>

        <!-- ИЗБРАННОЕ -->
        <div v-else-if="tab === 'favorites'" class="grid gap-10">
          <div>
            <h2 class="mb-4 text-2xl font-medium">Заведения</h2>
            <div v-if="favVenues.length" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <VenueCard v-for="v in favVenues" :key="v.slug" :venue="v" />
            </div>
            <p v-else class="card p-5 text-sm text-muted">Нажмите ♥ на карточке бара, чтобы сохранить его здесь.</p>
          </div>
          <div>
            <h2 class="mb-4 text-2xl font-medium">Артисты и подписки</h2>
            <div v-if="favArtists.length" class="grid gap-2">
              <div v-for="a in favArtists" :key="a.slug" class="card flex items-center gap-4 p-3 pr-4">
                <PhotoImg :src="a.photo" class="size-14 shrink-0 rounded-xl" />
                <NuxtLink :to="`/artists/${a.slug}`" class="min-w-0 flex-1">
                  <p class="truncate font-medium hover:text-accent-text">{{ a.name }}</p>
                  <p class="text-xs text-muted">{{ favs.follows.includes(a.slug) ? 'Подписка на уведомления' : 'В избранном' }}</p>
                </NuxtLink>
                <button
                  class="btn-dark"
                  @click="favs.follows.includes(a.slug) ? toggle('follows', a.slug) : toggle('artists', a.slug)"
                >
                  Убрать
                </button>
              </div>
            </div>
            <p v-else class="card p-5 text-sm text-muted">Подпишитесь на группу, чтобы не пропустить её концерты.</p>
          </div>
        </div>

        <!-- ОТЗЫВЫ -->
        <div v-else-if="tab === 'reviews'" class="grid gap-3">
          <template v-if="myReviews.length">
            <article v-for="r in myReviews" :key="r.id" class="card p-5">
              <div class="mb-2 flex items-center justify-between gap-4">
                <NuxtLink :to="`/venues/${r.venue}`" class="font-medium hover:text-accent-text">{{ getVenue(r.venue)?.name }}</NuxtLink>
                <RatingStars :model-value="r.rating" :size="14" />
              </div>
              <p class="text-soft">{{ r.text }}</p>
              <p class="mt-2 text-xs text-muted">{{ formatDate(r.date) }}</p>
            </article>
          </template>
          <EmptyState v-else icon="star" title="Вы ещё не оставляли отзывов" text="Делитесь впечатлениями после концертов — это помогает другим выбрать бар." />
        </div>

        <!-- УВЕДОМЛЕНИЯ -->
        <div v-else-if="tab === 'notifications'" class="grid gap-3">
          <div class="card divide-y divide-line px-5 sm:px-6">
            <ToggleSwitch v-model="notify.reminders" label="Напоминания о событиях" hint="За день и за 3 часа до начала" />
            <ToggleSwitch v-model="notify.artists" label="Новые концерты артистов" hint="От групп, на которые вы подписаны" />
            <ToggleSwitch v-model="notify.venues" label="Афиша избранных баров" hint="Когда добавляется новое событие" />
            <ToggleSwitch v-model="notify.digest" label="Подборка на выходные" hint="Каждую пятницу в 12:00" />
          </div>
          <div class="card divide-y divide-line px-5 sm:px-6">
            <ToggleSwitch v-model="notify.email" label="Email" :hint="user?.email" />
            <ToggleSwitch v-model="notify.push" label="Push-уведомления" hint="В браузере и мобильном приложении" />
          </div>
        </div>
      </div>
    </div>

    <!-- QR -->
    <AppModal v-model="qrOpen" title="Электронный билет">
      <template v-if="qrTicket">
        <div class="flex flex-col items-center text-center">
          <TicketQr :value="`JOINED:${qrTicket}`" :size="240" />
          <p class="mt-5 text-lg font-medium">{{ getEvent(tickets.find(t => t.id === qrTicket)!.eventId)!.title }}</p>
          <p class="mt-1 text-sm text-muted">Покажите код на входе · № {{ qrTicket }}</p>
        </div>
      </template>
    </AppModal>

    <!-- Возврат -->
    <AppModal v-model="refundOpen" title="Вернуть билет?">
      <p class="text-soft">Деньги вернутся на карту в течение 3–5 рабочих дней. Сервисный сбор не возвращается.</p>
      <div class="mt-6 grid grid-cols-2 gap-2">
        <button class="btn-dark py-3" @click="refundId = null">Оставить</button>
        <button class="btn-primary py-3" @click="confirmRefund">Оформить возврат</button>
      </div>
    </AppModal>
  </section>
</template>

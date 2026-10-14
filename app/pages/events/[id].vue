<script setup lang="ts">
import type { TicketTypeId } from '~/data/types'
import { genreName, getArtist, getEvent, getVenue, isUpcoming } from '~/data/catalog'

const route = useRoute()
const found = getEvent(String(route.params.id))
if (!found) throw createError({ statusCode: 404, message: 'Событие не найдено', fatal: true })
const ev = found
const venue = getVenue(ev.venue)!
const lineup = ev.artists.map(getArtist).filter(a => !!a)
const upcoming = isUpcoming(ev)

useHead({ title: `${ev.title} — Joined`, meta: [{ name: 'description', content: ev.description }] })

const { requireAuth } = useAuth()
const { buy } = useTickets()
const { push } = useToast()

const selected = ref<TicketTypeId>(ev.tickets[0]!.id)
const qty = ref(1)
const ticket = computed(() => ev.tickets.find(t => t.id === selected.value)!)
const maxQty = computed(() => Math.min(ticket.value.left, ticket.value.id === 'table' ? 2 : 6))
watch(selected, () => { qty.value = 1 })
const total = computed(() => ticket.value.price * qty.value)

const payOpen = ref(false)
const checkout = () => {
  if (!requireAuth()) return
  payOpen.value = true
}
const onPaid = () => {
  buy({ eventId: ev.id, type: selected.value, qty: qty.value, total: total.value })
  push('Билеты оплачены! QR-код — в личном кабинете')
  navigateTo('/account?tab=tickets')
}
</script>

<template>
  <div>
    <section class="container-x pt-6">
      <NuxtLink to="/events" class="mb-5 inline-flex items-center gap-1 text-sm text-muted hover:text-white">
        <AppIcon name="chevron-left" :size="16" /> Афиша
      </NuxtLink>

      <div class="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <!-- Левая колонка -->
        <div class="grid gap-3">
          <PhotoImg :src="ev.photo" :alt="ev.title" class="aspect-4/3 rounded-4xl sm:aspect-video">
            <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />
            <div class="absolute inset-x-0 bottom-0 p-5 sm:p-10">
              <div class="mb-4 flex flex-wrap gap-1.5">
                <span v-for="g in ev.genres" :key="g" class="tag">{{ genreName(g) }}</span>
              </div>
              <h1 class="h-display text-4xl sm:text-6xl lg:text-7xl">{{ ev.title }}</h1>
            </div>
          </PhotoImg>

          <div class="card grid grid-cols-1 gap-5 p-6 sm:grid-cols-3">
            <div class="flex items-start gap-3">
              <AppIcon name="calendar" class="mt-0.5 text-accent" />
              <div>
                <p class="font-medium">{{ formatDay(ev.date) }}</p>
                <p class="text-sm text-muted capitalize">{{ formatWeekdayLong(ev.date) }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <AppIcon name="clock" class="mt-0.5 text-accent" />
              <div>
                <p class="font-medium">Начало в {{ ev.time }}</p>
                <p class="text-sm text-muted">открытие дверей за час</p>
              </div>
            </div>
            <NuxtLink :to="`/venues/${venue.slug}`" class="group flex items-start gap-3">
              <AppIcon name="pin" class="mt-0.5 text-accent" />
              <div>
                <p class="font-medium group-hover:text-accent-text">{{ venue.name }}</p>
                <p class="text-sm text-muted">{{ venue.address }}</p>
              </div>
            </NuxtLink>
          </div>

          <div class="card p-6 sm:p-8">
            <h2 class="mb-3 text-2xl font-medium">О событии</h2>
            <p class="leading-relaxed text-soft">{{ ev.description }}</p>
          </div>

          <div v-if="lineup.length" class="card p-6 sm:p-8">
            <h2 class="mb-5 text-2xl font-medium">Лайнап</h2>
            <div class="grid gap-3 sm:grid-cols-2">
              <NuxtLink v-for="a in lineup" :key="a!.slug" :to="`/artists/${a!.slug}`" class="group flex items-center gap-4 rounded-2xl bg-card-2 p-3">
                <PhotoImg :src="a!.photo" class="size-16 shrink-0 rounded-xl" />
                <div class="min-w-0">
                  <p class="truncate font-medium group-hover:text-accent-text">{{ a!.name }}</p>
                  <p class="truncate text-sm text-muted">{{ a!.genres.map(genreName).join(', ') }}</p>
                </div>
                <AppIcon name="arrow-up-right" class="ml-auto text-muted" :size="18" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Покупка билетов -->
        <aside class="lg:sticky lg:top-24 lg:h-fit">
          <div class="card p-5 sm:p-6">
            <h2 class="mb-1 text-2xl font-medium">Билеты</h2>
            <p class="mb-5 text-sm text-muted">Электронный билет с QR-кодом придёт в личный кабинет</p>

            <template v-if="upcoming">
              <div class="grid gap-2" role="radiogroup" aria-label="Тип билета">
                <button
                  v-for="t in ev.tickets"
                  :key="t.id"
                  role="radio"
                  :aria-checked="selected === t.id"
                  :disabled="!t.left"
                  class="rounded-2xl border p-4 text-left transition-colors disabled:opacity-40"
                  :class="selected === t.id ? 'border-accent bg-accent-deep' : 'border-line hover:border-[#3a3a3a]'"
                  @click="selected = t.id"
                >
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-medium">{{ t.name }}</span>
                    <span class="font-medium">{{ formatPrice(t.price) }}</span>
                  </div>
                  <p class="mt-1 text-sm text-muted">{{ t.desc }}</p>
                  <p class="mt-2 text-xs" :class="t.left < 15 ? 'text-accent-text' : 'text-muted'">
                    {{ t.left ? `Осталось ${t.left}` : 'Распродано' }}
                  </p>
                </button>
              </div>

              <div class="mt-5 flex items-center justify-between">
                <span class="text-sm text-soft">Количество</span>
                <div class="flex items-center gap-3">
                  <button class="grid size-9 place-items-center rounded-lg bg-card-2 disabled:opacity-40" :disabled="qty <= 1" aria-label="Меньше" @click="qty--"><AppIcon name="minus" :size="16" /></button>
                  <span class="w-6 text-center font-medium">{{ qty }}</span>
                  <button class="grid size-9 place-items-center rounded-lg bg-card-2 disabled:opacity-40" :disabled="qty >= maxQty" aria-label="Больше" @click="qty++"><AppIcon name="plus" :size="16" /></button>
                </div>
              </div>

              <div class="mt-5 flex items-baseline justify-between border-t border-line pt-5">
                <span class="text-soft">Итого</span>
                <span class="text-3xl font-medium">{{ formatPrice(total) }}</span>
              </div>
              <button class="btn-primary mt-5 w-full py-3.5" :disabled="!ticket.left" @click="checkout">
                <AppIcon name="ticket" :size="18" /> Купить билет
              </button>
              <p class="mt-3 text-center text-xs text-muted">Возврат — до 72 часов до начала события</p>
            </template>
            <EmptyState v-else icon="clock" title="Событие прошло" text="Посмотрите другие концерты в афише." />
          </div>
        </aside>
      </div>
    </section>

    <PaymentModal
      v-model="payOpen"
      :amount="total"
      :title="ev.title"
      :lines="[
        { label: 'Дата', value: `${formatDay(ev.date)}, ${ev.time}` },
        { label: 'Место', value: venue.name },
        { label: `${ticket.name} × ${qty}`, value: formatPrice(total) },
      ]"
      @paid="onPaid"
    />
  </div>
</template>

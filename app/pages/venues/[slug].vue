<script setup lang="ts">
import { cityName, drinkName, events, formatName, genreName, getVenue, isUpcoming, reviews, todayISO } from '~/data/catalog'

const route = useRoute()
const venue = getVenue(String(route.params.slug))
if (!venue) throw createError({ statusCode: 404, message: 'Заведение не найдено', fatal: true })
const v = venue

useHead({ title: `${v.name} — Joined`, meta: [{ name: 'description', content: v.short }] })

const { has, toggle } = useFavorites()
const { user, requireAuth } = useAuth()
const { book, myReviews, addReview } = useTickets()
const { push } = useToast()

const tabs = [
  { id: 'schedule', name: 'Афиша' },
  { id: 'about', name: 'О заведении' },
  { id: 'menu', name: 'Меню' },
  { id: 'gallery', name: 'Галерея' },
  { id: 'booking', name: 'Бронирование' },
  { id: 'reviews', name: 'Отзывы' },
  { id: 'rules', name: 'Правила' },
] as const
type TabId = typeof tabs[number]['id']
const tab = ref<TabId>((tabs.find(t => t.id === route.query.tab)?.id) ?? 'schedule')
watch(tab, t => navigateTo({ query: { ...route.query, tab: t } }, { replace: true }))

/** Индекс сегодняшнего дня недели в графике (0 = Пн) */
const todayIdx = (new Date().getDay() + 6) % 7

const venueEvents = computed(() => events.filter(e => e.venue === v.slug && isUpcoming(e)))

// --- Меню
const menuTab = ref<'bar' | 'kitchen'>('bar')

// --- Галерея
const lightbox = ref<number | null>(null)
const step = (d: number) => {
  if (lightbox.value !== null) lightbox.value = Math.min(Math.max(lightbox.value + d, 0), v.gallery.length - 1)
}
const lightboxOpen = computed({ get: () => lightbox.value !== null, set: (x) => { if (!x) lightbox.value = null } })

// --- Бронирование
const slots = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
const form = reactive({ date: todayISO(), time: '20:00', guests: 2, comment: '' })
const deposit = computed(() => form.guests * v.booking.deposit)
const payOpen = ref(false)

const startBooking = () => {
  if (!requireAuth()) return
  payOpen.value = true
}
const onPaid = () => {
  book({ venue: v.slug, date: form.date, time: form.time, guests: form.guests, deposit: deposit.value, comment: form.comment })
  push('Столик забронирован! Детали — в личном кабинете')
  navigateTo('/account?tab=bookings')
}

// --- Отзывы
const allReviews = computed(() => [
  ...myReviews.value.filter(r => r.venue === v.slug).map(r => ({ ...r, author: user.value?.name ?? 'Вы' })),
  ...reviews.filter(r => r.venue === v.slug),
])
const distribution = computed(() => {
  const total = allReviews.value.length || 1
  return [5, 4, 3, 2, 1].map(n => ({ n, pct: Math.round((allReviews.value.filter(r => r.rating === n).length / total) * 100) }))
})
const draft = reactive({ rating: 0, text: '' })
const submitReview = () => {
  if (!requireAuth()) return
  if (!draft.rating || draft.text.trim().length < 10) return push('Поставьте оценку и напишите пару предложений')
  addReview({ venue: v.slug, rating: draft.rating, text: draft.text.trim() })
  Object.assign(draft, { rating: 0, text: '' })
  push('Спасибо! Отзыв опубликован')
}

const share = async () => {
  const url = window.location.href
  if (navigator.share) await navigator.share({ title: v.name, url }).catch(() => {})
  else {
    await navigator.clipboard.writeText(url)
    push('Ссылка скопирована')
  }
}
</script>

<template>
  <div>
    <!-- Обложка -->
    <section class="container-x pt-6">
      <NuxtLink to="/venues" class="mb-5 inline-flex items-center gap-1 text-sm text-muted hover:text-white">
        <AppIcon name="chevron-left" :size="16" /> Все заведения
      </NuxtLink>
      <div class="grid gap-3 lg:grid-cols-[2fr_1fr]">
        <PhotoImg :src="v.photo" :alt="v.name" class="aspect-4/3 rounded-4xl sm:aspect-video lg:aspect-auto lg:min-h-120">
          <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
          <div class="absolute inset-x-0 bottom-0 p-5 sm:p-10">
            <div class="mb-4 flex flex-wrap gap-1.5">
              <span class="tag">{{ formatName(v.format) }}</span>
              <span v-for="g in v.genres" :key="g" class="tag border-white/10 bg-black/50 text-white backdrop-blur">{{ genreName(g) }}</span>
            </div>
            <h1 class="h-display text-5xl sm:text-7xl lg:text-8xl">{{ v.name }}</h1>
            <p class="mt-3 max-w-xl text-white/80">{{ v.short }}</p>
          </div>
        </PhotoImg>
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:grid-rows-2">
          <PhotoImg :src="v.gallery[0]!" class="aspect-square rounded-4xl lg:aspect-auto" />
          <PhotoImg :src="v.gallery[2]!" class="aspect-square rounded-4xl lg:aspect-auto" />
        </div>
      </div>

      <!-- Быстрые факты и действия -->
      <div class="mt-3 grid gap-3 lg:grid-cols-[2fr_1fr]">
        <div class="card grid grid-cols-2 gap-4 p-5 sm:grid-cols-4 sm:p-6">
          <div>
            <p class="text-xs text-muted">Рейтинг</p>
            <p class="mt-1 flex items-center gap-1.5 text-xl font-medium"><AppIcon name="star" filled class="text-accent" :size="18" />{{ v.rating }}</p>
            <p class="text-xs text-muted">{{ v.reviewsCount }} {{ plural(v.reviewsCount, ['отзыв', 'отзыва', 'отзывов']) }}</p>
          </div>
          <div>
            <p class="text-xs text-muted">Средний чек</p>
            <p class="mt-1 text-xl font-medium">{{ formatPrice(v.avgCheck) }}</p>
          </div>
          <div>
            <p class="text-xs text-muted">Сегодня</p>
            <p class="mt-1 text-xl font-medium">{{ v.hours[todayIdx]!.time }}</p>
          </div>
          <div>
            <p class="text-xs text-muted">Адрес</p>
            <p class="mt-1 text-sm">{{ cityName(v.city) }}, {{ v.address }}</p>
          </div>
        </div>
        <div class="card flex items-center gap-2 p-3">
          <button class="btn-primary flex-1 py-3.5" @click="tab = 'booking'">
            <AppIcon name="calendar" :size="18" /> Забронировать
          </button>
          <button
            class="grid size-12 shrink-0 place-items-center rounded-xl bg-card-2 hover:bg-card-3"
            :class="has('venues', v.slug) ? 'text-accent' : ''"
            :aria-label="has('venues', v.slug) ? 'Убрать из избранного' : 'В избранное'"
            @click="toggle('venues', v.slug)"
          >
            <AppIcon name="heart" :filled="has('venues', v.slug)" />
          </button>
          <button class="grid size-12 shrink-0 place-items-center rounded-xl bg-card-2 hover:bg-card-3" aria-label="Поделиться" @click="share">
            <AppIcon name="share" />
          </button>
        </div>
      </div>
    </section>

    <!-- Вкладки -->
    <nav class="sticky top-18 z-30 mt-10 border-y border-white/5 bg-ink/85 backdrop-blur-xl">
      <div class="container-x scroll-x py-3">
        <button v-for="t in tabs" :key="t.id" class="pill" :class="{ 'pill-active': tab === t.id }" @click="tab = t.id">
          {{ t.name }}
        </button>
      </div>
    </nav>

    <section class="container-x pt-10">
      <!-- АФИША -->
      <div v-if="tab === 'schedule'">
        <h2 class="h-display mb-8 text-4xl sm:text-5xl">Музыкальный календарь</h2>
        <EventCalendar :events="venueEvents" />
      </div>

      <!-- О ЗАВЕДЕНИИ -->
      <div v-else-if="tab === 'about'" class="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
        <div class="grid gap-3">
          <div class="card p-6 sm:p-8">
            <h2 class="mb-4 text-2xl font-medium">О заведении</h2>
            <p class="leading-relaxed text-soft">{{ v.description }}</p>
            <h3 class="mt-8 mb-3 text-sm text-muted">Бар и кухня</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="d in v.drinks" :key="d" class="pill pointer-events-none">{{ drinkName(d) }}</span>
            </div>
          </div>
          <div class="card overflow-hidden">
            <div class="h-72">
              <ClientOnly><VenueMap :venues="[v]" :center="v" :zoom="15" /></ClientOnly>
            </div>
            <div class="p-6">
              <h3 class="mb-2 flex items-center gap-2 font-medium"><AppIcon name="pin" class="text-accent" :size="18" /> Как добраться</h3>
              <p class="text-sm text-soft">{{ v.address }}<span v-if="v.metro"> · м. {{ v.metro }}</span></p>
              <p class="mt-2 text-sm text-muted">{{ v.directions }}</p>
            </div>
          </div>
        </div>
        <div class="grid h-fit gap-3">
          <div class="card p-6">
            <h3 class="mb-4 flex items-center gap-2 font-medium"><AppIcon name="clock" class="text-accent" :size="18" /> График работы</h3>
            <dl class="space-y-2 text-sm">
              <div v-for="(h, i) in v.hours" :key="h.day" class="flex justify-between" :class="i === todayIdx ? 'text-accent-text' : ''">
                <dt :class="i === todayIdx ? '' : 'text-soft'">{{ h.day }}</dt>
                <dd>{{ h.time }}</dd>
              </div>
            </dl>
          </div>
          <div class="card p-6">
            <h3 class="mb-4 font-medium">Контакты</h3>
            <ul class="space-y-3 text-sm">
              <li><a :href="`tel:${v.phone.replace(/[^\d+]/g, '')}`" class="flex items-center gap-3 hover:text-accent-text"><AppIcon name="phone" :size="18" class="text-muted" />{{ v.phone }}</a></li>
              <li><a href="#" class="flex items-center gap-3 hover:text-accent-text"><AppIcon name="instagram" :size="18" class="text-muted" />{{ v.instagram }}</a></li>
              <li><a href="#" class="flex items-center gap-3 hover:text-accent-text"><AppIcon name="telegram" :size="18" class="text-muted" />{{ v.telegram }}</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- МЕНЮ -->
      <div v-else-if="tab === 'menu'">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 class="h-display text-4xl sm:text-5xl">Меню</h2>
          <div class="inline-grid grid-cols-2 gap-1 rounded-xl bg-card p-1">
            <button class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm" :class="menuTab === 'bar' ? 'bg-card-2' : 'text-muted'" @click="menuTab = 'bar'"><AppIcon name="glass" :size="16" /> Бар</button>
            <button class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm" :class="menuTab === 'kitchen' ? 'bg-card-2' : 'text-muted'" @click="menuTab = 'kitchen'"><AppIcon name="utensils" :size="16" /> Кухня</button>
          </div>
        </div>
        <div class="grid gap-x-12 md:grid-cols-2">
          <div v-for="item in v.menu[menuTab]" :key="item.name" class="flex items-baseline gap-3 border-b border-line py-5">
            <div class="min-w-0">
              <p class="font-medium">{{ item.name }}</p>
              <p v-if="item.desc" class="mt-1 text-sm text-muted">{{ item.desc }}</p>
            </div>
            <span class="mx-1 flex-1 -translate-y-1 border-b border-dotted border-[#333]" />
            <span class="shrink-0 font-medium text-accent-text">{{ formatPrice(item.price) }}</span>
          </div>
        </div>
      </div>

      <!-- ГАЛЕРЕЯ -->
      <div v-else-if="tab === 'gallery'">
        <h2 class="h-display mb-8 text-4xl sm:text-5xl">Интерьер и события</h2>
        <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
          <button v-for="(src, i) in v.gallery" :key="src" class="group overflow-hidden rounded-card" :class="i === 0 ? 'col-span-2 row-span-2' : ''" @click="lightbox = i">
            <PhotoImg :src="src" class="aspect-square transition-transform duration-500 group-hover:scale-105" />
          </button>
        </div>
        <AppModal v-model="lightboxOpen" :title="`${(lightbox ?? 0) + 1} / ${v.gallery.length}`" wide>
          <PhotoImg v-if="lightbox !== null" :src="v.gallery[lightbox]!" class="aspect-4/3 rounded-2xl" />
          <div class="mt-4 flex justify-between">
            <button class="btn-dark" :disabled="!lightbox" @click="step(-1)"><AppIcon name="chevron-left" :size="16" /> Назад</button>
            <button class="btn-dark" :disabled="lightbox === v.gallery.length - 1" @click="step(1)">Вперёд <AppIcon name="chevron-right" :size="16" /></button>
          </div>
        </AppModal>
      </div>

      <!-- БРОНИРОВАНИЕ -->
      <div v-else-if="tab === 'booking'" class="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
        <form class="card p-6 sm:p-8" @submit.prevent="startBooking">
          <h2 class="mb-6 text-2xl font-medium">Забронировать столик</h2>
          <div class="grid gap-5">
            <label>
              <span class="label">Дата</span>
              <input v-model="form.date" type="date" :min="todayISO()" required class="field">
            </label>
            <div>
              <span class="label">Время</span>
              <div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
                <button v-for="s in slots" :key="s" type="button" class="rounded-xl py-2.5 text-sm transition-colors" :class="form.time === s ? 'bg-accent' : 'bg-card-2 hover:bg-card-3'" @click="form.time = s">{{ s }}</button>
              </div>
            </div>
            <div>
              <span class="label">Количество гостей</span>
              <div class="flex items-center gap-3">
                <button type="button" class="grid size-11 place-items-center rounded-xl bg-card-2 hover:bg-card-3 disabled:opacity-40" :disabled="form.guests <= v.booking.minGuests" aria-label="Меньше" @click="form.guests--"><AppIcon name="minus" :size="18" /></button>
                <span class="w-10 text-center text-xl font-medium">{{ form.guests }}</span>
                <button type="button" class="grid size-11 place-items-center rounded-xl bg-card-2 hover:bg-card-3 disabled:opacity-40" :disabled="form.guests >= v.booking.maxGuests" aria-label="Больше" @click="form.guests++"><AppIcon name="plus" :size="18" /></button>
                <span class="text-sm text-muted">до {{ v.booking.maxGuests }} человек</span>
              </div>
            </div>
            <label>
              <span class="label">Пожелания</span>
              <textarea v-model="form.comment" rows="3" class="field resize-none" placeholder="Например: столик у сцены, день рождения" />
            </label>
          </div>
          <div class="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-muted">Депозит ({{ form.guests }} × {{ formatPrice(v.booking.deposit) }})</p>
              <p class="text-3xl font-medium">{{ formatPrice(deposit) }}</p>
            </div>
            <button class="btn-primary px-8 py-3.5" type="submit">Внести депозит</button>
          </div>
        </form>
        <div class="card h-fit p-6">
          <h3 class="mb-4 flex items-center gap-2 font-medium"><AppIcon name="info" class="text-accent" :size="18" /> Условия бронирования</h3>
          <ul class="space-y-3 text-sm text-soft">
            <li v-for="c in v.booking.conditions" :key="c" class="flex gap-3"><AppIcon name="check" :size="16" class="mt-0.5 text-accent" />{{ c }}</li>
          </ul>
        </div>
        <PaymentModal
          v-model="payOpen"
          :amount="deposit"
          :title="`Депозит · ${v.name}`"
          :lines="[{ label: 'Дата', value: `${formatDay(form.date)}, ${form.time}` }, { label: 'Гостей', value: String(form.guests) }]"
          @paid="onPaid"
        />
      </div>

      <!-- ОТЗЫВЫ -->
      <div v-else-if="tab === 'reviews'" class="grid gap-3 lg:grid-cols-[1fr_1.6fr]">
        <div class="grid h-fit gap-3">
          <div class="card p-6">
            <div class="flex items-end gap-3">
              <span class="h-display text-7xl">{{ v.rating }}</span>
              <div class="pb-2">
                <RatingStars :model-value="v.rating" />
                <p class="text-sm text-muted">{{ v.reviewsCount }} {{ plural(v.reviewsCount, ['отзыв', 'отзыва', 'отзывов']) }}</p>
              </div>
            </div>
            <div class="mt-6 space-y-2">
              <div v-for="d in distribution" :key="d.n" class="flex items-center gap-3 text-sm">
                <span class="w-3 text-muted">{{ d.n }}</span>
                <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-card-2"><div class="h-full rounded-full bg-accent" :style="{ width: `${d.pct}%` }" /></div>
                <span class="w-9 text-right text-muted">{{ d.pct }}%</span>
              </div>
            </div>
          </div>
          <form class="card p-6" @submit.prevent="submitReview">
            <h3 class="mb-3 font-medium">Оставить отзыв</h3>
            <RatingStars v-model="draft.rating" editable :size="24" />
            <textarea v-model="draft.text" rows="4" class="field mt-4 resize-none" placeholder="Как вам музыка, звук, бар?" />
            <button class="btn-primary mt-3 w-full" type="submit">Опубликовать</button>
          </form>
        </div>
        <div class="grid h-fit gap-3">
          <article v-for="r in allReviews" :key="r.id" class="card p-6">
            <div class="mb-3 flex items-center gap-3">
              <span class="grid size-10 place-items-center rounded-full bg-card-2 font-medium">{{ r.author[0] }}</span>
              <div>
                <p class="font-medium">{{ r.author }}</p>
                <p class="text-xs text-muted">{{ formatDate(r.date) }}</p>
              </div>
              <RatingStars :model-value="r.rating" class="ml-auto" :size="14" />
            </div>
            <p class="text-soft">{{ r.text }}</p>
          </article>
          <EmptyState v-if="!allReviews.length" icon="star" title="Отзывов пока нет" text="Станьте первым, кто поделится впечатлениями." />
        </div>
      </div>

      <!-- ПРАВИЛА -->
      <div v-else-if="tab === 'rules'" class="max-w-3xl">
        <h2 class="h-display mb-8 text-4xl sm:text-5xl">Правила посещения</h2>
        <ol class="grid gap-3">
          <li v-for="(r, i) in v.rules" :key="r" class="card flex gap-5 p-5">
            <span class="text-2xl font-medium text-accent">{{ String(i + 1).padStart(2, '0') }}</span>
            <p class="pt-1 text-soft">{{ r }}</p>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

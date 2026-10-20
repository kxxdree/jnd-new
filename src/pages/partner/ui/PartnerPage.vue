<script setup lang="ts">
import { getArtist } from '@entities/artist'
import { type EventItem, events, isUpcoming } from '@entities/event'
import { useSession } from '@entities/session'
import { getVenue, venues } from '@entities/venue'
import { type GenreId, genres } from '@shared/config'
import { addDays, formatDay, formatPrice, ph, plural, todayISO, useToast } from '@shared/lib'
import { UiBarChart, UiIcon, UiModal, UiPhoto, UiPills, UiTabs } from '@shared/ui'

useHead({ title: 'Кабинет партнёра - Joined' })

const { user } = useSession()
const { push } = useToast()
const isVenue = computed(() => user.value?.role !== 'artist')

// Демо: владелец управляет Red Velvet, группа - Orange Sunset
const venue = getVenue('red-velvet')!
const artist = getArtist('orange-sunset')!

type Tab = 'overview' | 'profile' | 'events' | 'bookings' | 'media'
const tabs = computed(() => [
  { id: 'overview' as Tab, name: 'Обзор', icon: 'chart' },
  { id: 'profile' as Tab, name: isVenue.value ? 'Профиль заведения' : 'Профиль группы', icon: 'edit' },
  { id: 'events' as Tab, name: 'Мероприятия', icon: 'calendar' },
  ...(isVenue.value ? [{ id: 'bookings' as Tab, name: 'Бронирования', icon: 'users', badge: incoming.value.filter(b => b.status === 'new').length }] : []),
  { id: 'media' as Tab, name: isVenue.value ? 'Фото и меню' : 'Медиа', icon: 'image' },
])
const tab = ref<Tab>('overview')

// --- Обзор
const kpis = computed(() => isVenue.value
  ? [
      { label: 'Просмотры профиля', value: '12 480', delta: '+18%' },
      { label: 'Продано билетов', value: '842', delta: '+9%' },
      { label: 'Брони за месяц', value: '214', delta: '+24%' },
      { label: 'Выручка', value: formatPrice(1284000), delta: '+12%' },
    ]
  : [
      { label: 'Просмотры профиля', value: '8 640', delta: '+11%' },
      { label: 'Прослушивания', value: '58 200', delta: '+31%' },
      { label: 'Продано билетов', value: '1 930', delta: '+14%' },
      { label: 'Концертов в месяц', value: '6', delta: '+2' },
    ])
const chart = [
  { label: 'Пн', value: 120 }, { label: 'Вт', value: 98 }, { label: 'Ср', value: 160 },
  { label: 'Чт', value: 210 }, { label: 'Пт', value: 420 }, { label: 'Сб', value: 480 }, { label: 'Вс', value: 260 },
]

// --- Профиль
const profile = reactive({
  name: isVenue.value ? venue.name : artist.name,
  short: isVenue.value ? venue.short : artist.short,
  description: isVenue.value ? venue.description : artist.bio,
  phone: venue.phone,
  address: venue.address,
  instagram: venue.instagram,
  genres: [...(isVenue.value ? venue.genres : artist.genres)] as GenreId[],
  rules: venue.rules.join('\n'),
  deposit: venue.booking.deposit,
})

// --- Мероприятия
const myEvents = ref<EventItem[]>(
  events.filter(e => isUpcoming(e) && (isVenue.value ? e.venue === venue.slug : e.artists.includes(artist.slug))),
)
const sold = (id: string) => (id.charCodeAt(id.length - 1) * 7) % 180 + 20
const newOpen = ref(false)
const draft = reactive({ title: '', date: todayISO(), time: '21:00', genre: 'live' as GenreId, price: 1000, vip: 0, description: '', venue: venue.slug })
const createEvent = () => {
  if (draft.title.trim().length < 3) return push('Укажите название события')
  myEvents.value = [{
    id: `new-${Date.now()}`,
    title: draft.title.trim(),
    venue: draft.venue,
    artists: isVenue.value ? [] : [artist.slug],
    genres: [draft.genre],
    date: draft.date,
    time: draft.time,
    description: draft.description,
    photo: ph('concert', Math.floor(Math.random() * 1000)),
    tickets: [
      { id: 'standard' as const, name: 'Стандарт', desc: '', price: draft.price, left: 100 },
      ...(draft.vip ? [{ id: 'vip' as const, name: 'VIP', desc: '', price: draft.vip, left: 20 }] : []),
    ],
  }, ...myEvents.value].sort((a, b) => a.date.localeCompare(b.date))
  newOpen.value = false
  draft.title = ''
  push('Событие создано и отправлено на модерацию')
}
const removeEvent = (id: string) => {
  myEvents.value = myEvents.value.filter(e => e.id !== id)
  push('Событие снято с публикации')
}

// --- Входящие брони (только для заведения)
type BookingStatus = 'new' | 'ok' | 'no'
const incoming = ref<{ id: string; name: string; phone: string; date: string; time: string; guests: number; status: BookingStatus }[]>([
  { id: 'b1', name: 'Мария Л.', phone: '+7 916 ***-12-40', date: todayISO(), time: '20:00', guests: 4, status: 'new' },
  { id: 'b2', name: 'Илья К.', phone: '+7 903 ***-55-11', date: todayISO(), time: '21:00', guests: 2, status: 'new' },
  { id: 'b3', name: 'Компания «Ромашка»', phone: '+7 495 ***-00-00', date: addDays(todayISO(), 2), time: '19:00', guests: 10, status: 'new' },
  { id: 'b4', name: 'Анна В.', phone: '+7 926 ***-87-01', date: addDays(todayISO(), 3), time: '22:00', guests: 3, status: 'ok' },
])
const setStatus = (id: string, status: Exclude<BookingStatus, 'new'>) => {
  incoming.value = incoming.value.map(b => (b.id === id ? { ...b, status } : b))
  push(status === 'ok' ? 'Бронь подтверждена, гостю отправлено уведомление' : 'Бронь отклонена')
}
</script>

<template>
  <section class="container-x pt-10">
    <div class="card mb-8 flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8">
      <div>
        <p class="text-xs font-medium tracking-[0.2em] text-accent-text uppercase">{{ isVenue ? 'Владелец заведения' : 'Музыкальная группа' }}</p>
        <h1 class="h-display mt-2 text-4xl sm:text-6xl">{{ profile.name }}</h1>
      </div>
      <NuxtLink :to="isVenue ? `/venues/${venue.slug}` : `/artists/${artist.slug}`" class="btn-dark">
        <UiIcon name="eye" :size="18" /> Публичная страница
      </NuxtLink>
    </div>

    <div class="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside class="lg:sticky lg:top-28 lg:h-fit"><UiTabs v-model="tab" :tabs="tabs" /></aside>

      <div class="min-w-0">
        <!-- ОБЗОР -->
        <div v-if="tab === 'overview'" class="grid gap-4">
          <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <div v-for="k in kpis" :key="k.label" class="card p-5">
              <p class="text-sm text-muted">{{ k.label }}</p>
              <p class="mt-2 text-2xl font-medium sm:text-3xl">{{ k.value }}</p>
              <p class="mt-1 text-xs text-accent-text">{{ k.delta }} к прошлому месяцу</p>
            </div>
          </div>
          <div class="card p-5 sm:p-6">
            <div class="mb-8 flex items-baseline justify-between">
              <h2 class="text-lg font-medium">{{ isVenue ? 'Посещаемость по дням недели' : 'Прослушивания за неделю' }}</h2>
              <span class="text-xs text-muted">последние 7 дней</span>
            </div>
            <UiBarChart :data="chart" />
          </div>
          <div class="card p-5 sm:p-6">
            <h2 class="mb-4 text-lg font-medium">Ближайшие события</h2>
            <div class="divide-y divide-line">
              <div v-for="e in myEvents.slice(0, 4)" :key="e.id" class="flex items-center gap-4 py-3">
                <span class="w-16 shrink-0 text-sm text-muted">{{ formatDay(e.date) }}</span>
                <span class="min-w-0 flex-1 truncate">{{ e.title }}</span>
                <span class="text-sm text-soft">{{ sold(e.id) }} {{ plural(sold(e.id), ['билет', 'билета', 'билетов']) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ПРОФИЛЬ -->
        <form v-else-if="tab === 'profile'" class="grid gap-4" @submit.prevent="push('Изменения отправлены на модерацию')">
          <div class="card grid gap-5 p-5 sm:p-8">
            <h2 class="text-xl font-medium">Основная информация</h2>
            <label><span class="label">Название</span><input v-model="profile.name" class="field"></label>
            <label><span class="label">Короткое описание</span><input v-model="profile.short" class="field"></label>
            <label><span class="label">{{ isVenue ? 'Описание' : 'О коллективе' }}</span><textarea v-model="profile.description" rows="5" class="field resize-none" /></label>
            <div>
              <span class="label">Музыкальные жанры</span>
              <UiPills v-model="profile.genres" :options="genres" multiple :all-label="false" />
            </div>
          </div>
          <div v-if="isVenue" class="card grid gap-5 p-5 sm:p-8">
            <h2 class="text-xl font-medium">Контакты и бронирование</h2>
            <div class="grid gap-5 sm:grid-cols-2">
              <label><span class="label">Телефон</span><input v-model="profile.phone" class="field"></label>
              <label><span class="label">Instagram</span><input v-model="profile.instagram" class="field"></label>
              <label class="sm:col-span-2"><span class="label">Адрес</span><input v-model="profile.address" class="field"></label>
              <label><span class="label">Депозит с гостя, ₽</span><input v-model.number="profile.deposit" type="number" min="0" step="100" class="field"></label>
            </div>
            <label><span class="label">Правила посещения (по строке на пункт)</span><textarea v-model="profile.rules" rows="5" class="field resize-none" /></label>
          </div>
          <div class="flex justify-end"><button class="btn-primary px-8 py-3.5" type="submit">Сохранить изменения</button></div>
        </form>

        <!-- МЕРОПРИЯТИЯ -->
        <div v-else-if="tab === 'events'" class="grid gap-4">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-medium">Мероприятия</h2>
            <button class="btn-primary" @click="newOpen = true"><UiIcon name="plus" :size="18" /> Новое событие</button>
          </div>
          <div v-for="e in myEvents" :key="e.id" class="card flex flex-col gap-4 p-3 pr-4 sm:flex-row sm:items-center">
            <UiPhoto :src="e.photo" class="hidden size-16 shrink-0 rounded-2xl sm:block" />
            <div class="min-w-0 flex-1 px-1 sm:px-0">
              <p class="truncate font-medium">{{ e.title }}</p>
              <p class="text-sm text-muted">{{ formatDay(e.date) }}, {{ e.time }} · {{ getVenue(e.venue)?.name ?? '-' }}</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-32">
                <div class="mb-1 flex justify-between text-xs text-muted"><span>Продано</span><span>{{ sold(e.id) }}/200</span></div>
                <div class="h-2 overflow-hidden rounded-full bg-black/30 shadow-[inset_0_1px_2px_rgb(0_0_0/0.4)]">
                  <div class="h-full rounded-full bg-linear-to-r from-[#ff4d00] to-[#ffb27a]" :style="{ width: `${sold(e.id) / 2}%` }" />
                </div>
              </div>
              <NuxtLink v-if="!e.id.startsWith('new')" :to="`/events/${e.id}`" class="btn-icon size-9" aria-label="Открыть"><UiIcon name="eye" :size="16" /></NuxtLink>
              <button class="btn-icon size-9" aria-label="Снять с публикации" @click="removeEvent(e.id)"><UiIcon name="trash" :size="16" /></button>
            </div>
          </div>
        </div>

        <!-- БРОНИ -->
        <div v-else-if="tab === 'bookings'" class="grid gap-4">
          <h2 class="text-2xl font-medium">Входящие брони</h2>
          <div v-for="b in incoming" :key="b.id" class="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div class="min-w-0 flex-1">
              <p class="font-medium">{{ b.name }} <span class="text-sm text-muted">· {{ b.phone }}</span></p>
              <p class="text-sm text-muted">{{ formatDay(b.date) }}, {{ b.time }} · {{ b.guests }} {{ plural(b.guests, ['гость', 'гостя', 'гостей']) }}</p>
            </div>
            <div v-if="b.status === 'new'" class="flex gap-2">
              <button class="btn-dark" @click="setStatus(b.id, 'no')">Отклонить</button>
              <button class="btn-primary" @click="setStatus(b.id, 'ok')">Подтвердить</button>
            </div>
            <span v-else class="tag" :class="b.status === 'no' ? 'tag-neutral' : ''">{{ b.status === 'ok' ? 'Подтверждена' : 'Отклонена' }}</span>
          </div>
        </div>

        <!-- МЕДИА -->
        <div v-else-if="tab === 'media'" class="grid gap-4">
          <div class="card p-5 sm:p-6">
            <div class="mb-5 flex items-center justify-between">
              <h2 class="text-xl font-medium">{{ isVenue ? 'Фотогалерея' : 'Фото и видео' }}</h2>
              <button class="btn-dark" @click="push('Загрузка файлов появится с бэкендом')"><UiIcon name="plus" :size="16" /> Загрузить</button>
            </div>
            <div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
              <UiPhoto v-for="src in venue.gallery" :key="src" :src="src" class="aspect-square rounded-2xl" />
            </div>
          </div>
          <div v-if="isVenue" class="card p-5 sm:p-6">
            <h2 class="mb-4 text-xl font-medium">Меню бара</h2>
            <div class="divide-y divide-line">
              <div v-for="m in venue.menu.bar" :key="m.name" class="flex items-center justify-between gap-4 py-3">
                <span class="truncate">{{ m.name }}</span>
                <span class="text-soft">{{ formatPrice(m.price) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UiModal v-model="newOpen" title="Новое событие">
      <form class="grid gap-4" @submit.prevent="createEvent">
        <label><span class="label">Название</span><input v-model="draft.title" class="field" placeholder="Например: Jazz Night"></label>
        <div class="grid grid-cols-2 gap-3">
          <label><span class="label">Дата</span><input v-model="draft.date" type="date" :min="todayISO()" class="field"></label>
          <label><span class="label">Начало</span><input v-model="draft.time" type="time" class="field"></label>
        </div>
        <label v-if="!isVenue">
          <span class="label">Площадка</span>
          <select v-model="draft.venue" class="field appearance-none">
            <option v-for="v in venues" :key="v.slug" :value="v.slug">{{ v.name }}</option>
          </select>
        </label>
        <label>
          <span class="label">Жанр</span>
          <select v-model="draft.genre" class="field appearance-none">
            <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
          </select>
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label><span class="label">Стандарт, ₽</span><input v-model.number="draft.price" type="number" min="0" step="100" class="field"></label>
          <label><span class="label">VIP, ₽ (0 - нет)</span><input v-model.number="draft.vip" type="number" min="0" step="100" class="field"></label>
        </div>
        <label><span class="label">Описание</span><textarea v-model="draft.description" rows="3" class="field resize-none" /></label>
        <button class="btn-primary mt-2 py-3.5" type="submit">Опубликовать</button>
      </form>
    </UiModal>
  </section>
</template>

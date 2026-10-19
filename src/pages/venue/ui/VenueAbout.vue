<script setup lang="ts">
import { drinkName, type Venue } from '@entities/venue'
import { weekdayIndex } from '@shared/lib'
import { UiIcon, UiYandexMap } from '@shared/ui'

defineProps<{ venue: Venue }>()
const todayIdx = weekdayIndex()
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
    <div class="grid gap-4">
      <div class="card p-6 sm:p-8">
        <h2 class="mb-4 text-2xl font-medium">О заведении</h2>
        <p class="leading-relaxed text-soft">{{ venue.description }}</p>
        <h3 class="mt-8 mb-3 text-sm text-muted">Бар и кухня</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="d in venue.drinks" :key="d" class="pill pointer-events-none">{{ drinkName(d) }}</span>
        </div>
      </div>
      <div class="card overflow-hidden p-1.5">
        <div class="h-72 overflow-hidden rounded-[1.4rem]">
          <UiYandexMap :lat="venue.lat" :lng="venue.lng" :title="venue.name" />
        </div>
        <div class="p-5">
          <h3 class="mb-2 flex items-center gap-2 font-medium"><UiIcon name="pin" class="text-accent-text" :size="18" /> Как добраться</h3>
          <p class="text-sm text-soft">{{ venue.address }}<span v-if="venue.metro"> · м. {{ venue.metro }}</span></p>
          <p class="mt-2 text-sm text-muted">{{ venue.directions }}</p>
        </div>
      </div>
    </div>
    <div class="grid h-fit gap-4">
      <div class="card p-6">
        <h3 class="mb-4 flex items-center gap-2 font-medium"><UiIcon name="clock" class="text-accent-text" :size="18" /> График работы</h3>
        <dl class="space-y-1 text-sm">
          <div
            v-for="(h, i) in venue.hours"
            :key="h.day"
            class="flex justify-between rounded-xl px-3 py-1.5"
            :class="i === todayIdx ? 'rim bg-[rgb(255_110_40/0.14)] text-white [--lg-rim:var(--lg-rim-warm)]' : ''"
          >
            <dt :class="i === todayIdx ? '' : 'text-soft'">{{ h.day }}<span v-if="i === todayIdx" class="ml-2 text-xs text-accent-text">сегодня</span></dt>
            <dd>{{ h.time }}</dd>
          </div>
        </dl>
      </div>
      <div class="card p-6">
        <h3 class="mb-4 font-medium">Контакты</h3>
        <ul class="space-y-3 text-sm">
          <li><a :href="`tel:${venue.phone.replace(/[^\d+]/g, '')}`" class="flex items-center gap-3 hover:text-sand"><span class="btn-icon size-9"><UiIcon name="phone" :size="16" /></span>{{ venue.phone }}</a></li>
          <li><a href="#" class="flex items-center gap-3 hover:text-sand"><span class="btn-icon size-9"><UiIcon name="instagram" :size="16" /></span>{{ venue.instagram }}</a></li>
          <li><a href="#" class="flex items-center gap-3 hover:text-sand"><span class="btn-icon size-9"><UiIcon name="telegram" :size="16" /></span>{{ venue.telegram }}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

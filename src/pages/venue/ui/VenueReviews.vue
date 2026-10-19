<script setup lang="ts">
import { ReviewCard, reviews, useMyReviews } from '@entities/review'
import { useSession } from '@entities/session'
import type { Venue } from '@entities/venue'
import { ReviewForm } from '@features/leave-review'
import { plural } from '@shared/lib'
import { UiEmpty, UiRating } from '@shared/ui'

const props = defineProps<{ venue: Venue }>()
const { user } = useSession()
const { myReviews } = useMyReviews()

const all = computed(() => [
  ...myReviews.value.filter(r => r.venue === props.venue.slug).map(r => ({ ...r, author: user.value?.name ?? 'Вы' })),
  ...reviews.filter(r => r.venue === props.venue.slug),
])
const distribution = computed(() => {
  const total = all.value.length || 1
  return [5, 4, 3, 2, 1].map(n => ({ n, pct: Math.round((all.value.filter(r => r.rating === n).length / total) * 100) }))
})
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
    <div class="grid h-fit gap-4">
      <div class="card p-6">
        <div class="flex items-end gap-3">
          <span class="h-display text-liquid text-7xl">{{ venue.rating }}</span>
          <div class="pb-2">
            <UiRating :model-value="venue.rating" />
            <p class="text-sm text-muted">{{ venue.reviewsCount }} {{ plural(venue.reviewsCount, ['отзыв', 'отзыва', 'отзывов']) }}</p>
          </div>
        </div>
        <div class="mt-6 space-y-2">
          <div v-for="d in distribution" :key="d.n" class="flex items-center gap-3 text-sm">
            <span class="w-3 text-muted">{{ d.n }}</span>
            <div class="h-2 flex-1 overflow-hidden rounded-full bg-black/30 shadow-[inset_0_1px_2px_rgb(0_0_0/0.4)]">
              <div class="h-full rounded-full bg-linear-to-r from-[#ff4d00] to-[#ffb27a]" :style="{ width: `${d.pct}%` }" />
            </div>
            <span class="w-9 text-right text-muted">{{ d.pct }}%</span>
          </div>
        </div>
      </div>
      <ReviewForm :venue="venue.slug" />
    </div>
    <div class="grid h-fit gap-4">
      <ReviewCard v-for="r in all" :key="r.id" :review="r" />
      <UiEmpty v-if="!all.length" icon="star" title="Отзывов пока нет" text="Станьте первым, кто поделится впечатлениями." />
    </div>
  </div>
</template>

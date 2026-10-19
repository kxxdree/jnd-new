<script setup lang="ts">
import { formatDate } from '@shared/lib'
import { UiRating } from '@shared/ui'
import type { Review } from '../model/types'

defineProps<{ review: Review }>()
</script>

<template>
  <article class="card p-6">
    <div class="mb-3 flex items-center gap-3">
      <span class="glass-chip grid size-10 place-items-center rounded-full font-medium">{{ review.author[0] }}</span>
      <div>
        <p class="font-medium">{{ review.author }}</p>
        <p class="text-xs text-muted">{{ formatDate(review.date) }}</p>
      </div>
      <UiRating :model-value="review.rating" class="ml-auto" :size="14" />
    </div>
    <p class="text-soft">{{ review.text }}</p>
  </article>
</template>

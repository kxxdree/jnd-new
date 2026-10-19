<script setup lang="ts">
import { useMyReviews } from '@entities/review'
import { useSession } from '@entities/session'
import { useToast } from '@shared/lib'
import { UiRating } from '@shared/ui'

const props = defineProps<{ venue: string }>()
const { requireAuth } = useSession()
const { add } = useMyReviews()
const { push } = useToast()

const draft = reactive({ rating: 0, text: '' })

const submit = () => {
  if (!requireAuth()) return
  if (!draft.rating || draft.text.trim().length < 10) return push('Поставьте оценку и напишите пару предложений')
  add({ venue: props.venue, rating: draft.rating, text: draft.text.trim() })
  Object.assign(draft, { rating: 0, text: '' })
  push('Спасибо! Отзыв опубликован')
}
</script>

<template>
  <form class="card p-6" @submit.prevent="submit">
    <h3 class="mb-3 font-medium">Оставить отзыв</h3>
    <UiRating v-model="draft.rating" editable :size="26" />
    <textarea v-model="draft.text" rows="4" class="field mt-4 resize-none" placeholder="Как вам музыка, звук, бар?" />
    <button class="btn-primary mt-3 w-full" type="submit">Опубликовать</button>
  </form>
</template>

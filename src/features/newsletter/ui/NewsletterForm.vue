<script setup lang="ts">
import { isEmail, useToast } from '@shared/lib'

const { push } = useToast()
const email = ref('')

const submit = () => {
  if (!isEmail(email.value)) return push('Введите корректный email')
  push('Готово! Подборки будут приходить по пятницам')
  email.value = ''
}
</script>

<template>
  <form class="search-bar flex gap-1.5 p-1.5" @submit.prevent="submit">
    <input v-model="email" type="email" placeholder="sample@gmail.com" aria-label="Email" class="min-w-0 flex-1 bg-transparent px-4 text-sm placeholder:text-white/50">
    <button class="btn-primary shrink-0" type="submit">Подписаться</button>
  </form>
</template>

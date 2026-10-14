<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const title = computed(() =>
  ({ 404: 'Страница не найдена', 403: 'Доступ закрыт' } as Record<number, string>)[props.error.statusCode] ?? 'Что-то пошло не так',
)
</script>

<template>
  <NuxtLayout>
    <section class="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p class="h-display text-[28vw] text-accent sm:text-[12rem]">{{ error.statusCode }}</p>
      <h1 class="mt-4 text-3xl font-medium tracking-tight">{{ title }}</h1>
      <p class="mt-2 max-w-md text-soft">{{ error.message || 'Похоже, этот трек закончился. Вернёмся на главную?' }}</p>
      <button class="btn-primary mt-8" @click="clearError({ redirect: '/' })">На главную</button>
    </section>
  </NuxtLayout>
</template>

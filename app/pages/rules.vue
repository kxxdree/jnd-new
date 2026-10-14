<script setup lang="ts">
useHead({ title: 'Условия сервиса — Joined' })

const sections = [
  { id: 'terms', title: 'Условия использования', items: [
    'Joined — агрегатор баров и музыкальных событий. Билеты и брони оформляются от имени организаторов и заведений.',
    'Покупать билеты и бронировать столики могут только авторизованные пользователи старше 18 лет.',
    'Организатор вправе изменить программу события; о существенных изменениях мы сообщаем по email и push.',
  ] },
  { id: 'refunds', title: 'Возврат билетов', items: [
    'Билет можно вернуть в личном кабинете не позднее чем за 72 часа до начала события.',
    'При отмене события организатором стоимость билета возвращается полностью, включая сервисный сбор.',
    'Депозит за бронь возвращается при отмене не позднее чем за 24 часа до визита.',
  ] },
  { id: 'privacy', title: 'Конфиденциальность', items: [
    'Мы храним только данные, необходимые для оформления билетов и броней.',
    'Заведение получает имя и телефон гостя только для подтверждения брони.',
    'Вы можете удалить аккаунт и все связанные данные в любой момент.',
  ] },
]
</script>

<template>
  <section class="container-x max-w-4xl pt-10 sm:pt-16">
    <h1 class="h-display text-[13vw] sm:text-8xl">Условия</h1>
    <div class="mt-12 grid gap-12">
      <div v-for="s in sections" :id="s.id" :key="s.id" class="scroll-mt-24">
        <h2 class="mb-5 text-2xl font-medium sm:text-3xl">{{ s.title }}</h2>
        <ol class="grid gap-3">
          <li v-for="(t, i) in s.items" :key="t" class="card flex gap-5 p-5">
            <span class="text-xl font-medium text-accent">{{ String(i + 1).padStart(2, '0') }}</span>
            <p class="text-soft">{{ t }}</p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

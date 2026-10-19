<script setup lang="ts">
import { usePersisted } from '@shared/lib'
import { UiToggle } from '@shared/ui'

defineProps<{ email?: string }>()

const notify = usePersisted('joined_notify', () => ({
  reminders: true,
  artists: true,
  venues: false,
  digest: true,
  email: true,
  push: false,
}))
</script>

<template>
  <div class="grid gap-3">
    <div class="card divide-y divide-line px-5 sm:px-6">
      <UiToggle v-model="notify.reminders" label="Напоминания о событиях" hint="За день и за 3 часа до начала" />
      <UiToggle v-model="notify.artists" label="Новые концерты артистов" hint="От групп, на которые вы подписаны" />
      <UiToggle v-model="notify.venues" label="Афиша избранных баров" hint="Когда добавляется новое событие" />
      <UiToggle v-model="notify.digest" label="Подборка на выходные" hint="Каждую пятницу в 12:00" />
    </div>
    <div class="card divide-y divide-line px-5 sm:px-6">
      <UiToggle v-model="notify.email" label="Email" :hint="email" />
      <UiToggle v-model="notify.push" label="Push-уведомления" hint="В браузере и мобильном приложении" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTickets } from '@entities/ticket'
import { useToast } from '@shared/lib'
import { UiModal } from '@shared/ui'

const props = defineProps<{ ticketId: string }>()
const { markRefunded } = useTickets()
const { push } = useToast()
const open = ref(false)

const confirm = () => {
  markRefunded(props.ticketId)
  open.value = false
  push('Возврат оформлен. Деньги вернутся в течение 3-5 дней')
}
</script>

<template>
  <button class="btn-dark flex-1" @click="open = true">Вернуть</button>
  <UiModal v-model="open" title="Вернуть билет?">
    <p class="text-soft">Деньги вернутся на карту в течение 3-5 рабочих дней. Сервисный сбор не возвращается.</p>
    <div class="mt-6 grid grid-cols-2 gap-2">
      <button class="btn-dark py-3" @click="open = false">Оставить</button>
      <button class="btn-primary py-3" @click="confirm">Оформить возврат</button>
    </div>
  </UiModal>
</template>

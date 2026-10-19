<script setup lang="ts">
import { type EventItem, isUpcoming, type TicketTypeId } from '@entities/event'
import { useSession } from '@entities/session'
import { useTickets } from '@entities/ticket'
import { formatDay, formatPrice, useToast } from '@shared/lib'
import { UiEmpty, UiIcon, UiPaymentSheet } from '@shared/ui'

const props = defineProps<{ event: EventItem; venueName: string }>()

const { requireAuth } = useSession()
const { add } = useTickets()
const { push } = useToast()

const upcoming = computed(() => isUpcoming(props.event))
const selected = ref<TicketTypeId>(props.event.tickets[0]!.id)
const qty = ref(1)
const ticket = computed(() => props.event.tickets.find(t => t.id === selected.value)!)
const maxQty = computed(() => Math.min(ticket.value.left, ticket.value.id === 'table' ? 2 : 6))
watch(selected, () => { qty.value = 1 })
const total = computed(() => ticket.value.price * qty.value)

const payOpen = ref(false)
const checkout = () => {
  if (requireAuth()) payOpen.value = true
}
const onPaid = () => {
  add({ eventId: props.event.id, type: selected.value, qty: qty.value, total: total.value })
  push('Билеты оплачены! QR-код - в личном кабинете')
  navigateTo('/account?tab=tickets')
}
</script>

<template>
  <div class="card p-5 sm:p-6">
    <h2 class="mb-1 text-2xl font-medium">Билеты</h2>
    <p class="mb-5 text-sm text-muted">Электронный билет с QR-кодом придёт в личный кабинет</p>

    <template v-if="upcoming">
      <div class="grid gap-2" role="radiogroup" aria-label="Тип билета">
        <button
          v-for="t in event.tickets"
          :key="t.id"
          role="radio"
          :aria-checked="selected === t.id"
          :disabled="!t.left"
          class="rim rounded-3xl p-4 text-left transition-all duration-300 disabled:opacity-40"
          :class="selected === t.id
            ? 'raised [background:linear-gradient(180deg,rgb(255_140_70/0.26),rgb(255_90_20/0.1)_50%,rgb(0_0_0/0.14)),rgb(46_24_14/0.8)] [--lg-rim:var(--lg-rim-warm)]'
            : 'raised'"
          @click="selected = t.id"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="font-medium">{{ t.name }}</span>
            <span class="font-medium">{{ formatPrice(t.price) }}</span>
          </div>
          <p class="mt-1 text-sm text-muted">{{ t.desc }}</p>
          <p class="mt-2 text-xs" :class="t.left < 15 ? 'text-accent-text' : 'text-muted'">
            {{ t.left ? `Осталось ${t.left}` : 'Распродано' }}
          </p>
        </button>
      </div>

      <div class="mt-5 flex items-center justify-between">
        <span class="text-sm text-soft">Количество</span>
        <div class="glass-chip flex items-center gap-1 rounded-full p-1">
          <button class="btn-icon size-9" :disabled="qty <= 1" aria-label="Меньше" @click="qty--"><UiIcon name="minus" :size="16" /></button>
          <span class="w-8 text-center font-medium">{{ qty }}</span>
          <button class="btn-icon size-9" :disabled="qty >= maxQty" aria-label="Больше" @click="qty++"><UiIcon name="plus" :size="16" /></button>
        </div>
      </div>

      <div class="mt-5 flex items-baseline justify-between border-t border-line pt-5">
        <span class="text-soft">Итого</span>
        <span class=" text-4xl font-medium">{{ formatPrice(total) }}</span>
      </div>
      <button class="btn-primary mt-5 w-full py-4 text-base" :disabled="!ticket.left" @click="checkout">
        <UiIcon name="ticket" :size="18" /> Купить билет
      </button>
      <p class="mt-3 text-center text-xs text-muted">Возврат - до 72 часов до начала события</p>
    </template>
    <UiEmpty v-else icon="clock" title="Событие прошло" text="Посмотрите другие концерты в афише." />

    <UiPaymentSheet
      v-model="payOpen"
      :amount="total"
      :title="event.title"
      :lines="[
        { label: 'Дата', value: `${formatDay(event.date)}, ${event.time}` },
        { label: 'Место', value: venueName },
        { label: `${ticket.name} × ${qty}`, value: formatPrice(total) },
      ]"
      @paid="onPaid"
    />
  </div>
</template>

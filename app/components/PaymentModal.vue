<script setup lang="ts">
/** Имитация оплаты: выбор способа, данные карты, обработка платежа */
const props = defineProps<{ amount: number; title: string; lines?: { label: string; value: string }[] }>()
const emit = defineEmits<{ paid: [] }>()
const open = defineModel<boolean>({ required: true })

const methods = [
  { id: 'card', name: 'Банковская карта', icon: 'card' },
  { id: 'sbp', name: 'СБП', icon: 'qr' },
  { id: 'wallet', name: 'Кошелёк', icon: 'wallet' },
]
const method = ref('card')
const card = reactive({ number: '', exp: '', cvc: '' })
const processing = ref(false)

const fmtNumber = (e: Event) => {
  const v = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 16)
  card.number = v.replace(/(.{4})/g, '$1 ').trim()
}
const fmtExp = (e: Event) => {
  const v = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4)
  card.exp = v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v
}

const valid = computed(() =>
  method.value !== 'card' || (card.number.replace(/\s/g, '').length === 16 && card.exp.length === 5 && card.cvc.length === 3),
)

const pay = async () => {
  processing.value = true
  await new Promise(r => setTimeout(r, 1200))
  processing.value = false
  open.value = false
  emit('paid')
}

watch(open, (v) => {
  if (v) Object.assign(card, { number: '', exp: '', cvc: '' })
})
</script>

<template>
  <AppModal v-model="open" title="Оплата">
    <div class="card mb-6 p-4">
      <p class="text-sm text-muted">{{ props.title }}</p>
      <dl v-if="lines?.length" class="mt-3 space-y-1.5 text-sm">
        <div v-for="l in lines" :key="l.label" class="flex justify-between gap-4">
          <dt class="text-soft">{{ l.label }}</dt>
          <dd>{{ l.value }}</dd>
        </div>
      </dl>
      <div class="mt-3 flex items-baseline justify-between border-t border-line pt-3">
        <span class="text-soft">Итого</span>
        <span class="text-2xl font-semibold">{{ formatPrice(amount) }}</span>
      </div>
    </div>

    <div class="mb-5 grid grid-cols-3 gap-2">
      <button
        v-for="m in methods"
        :key="m.id"
        type="button"
        class="flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-xs transition-colors"
        :class="method === m.id ? 'border-accent bg-accent-deep text-white' : 'border-line text-soft hover:border-[#3a3a3a]'"
        @click="method = m.id"
      >
        <AppIcon :name="m.icon" />
        {{ m.name }}
      </button>
    </div>

    <form class="grid gap-3" @submit.prevent="pay">
      <template v-if="method === 'card'">
        <input :value="card.number" inputmode="numeric" placeholder="0000 0000 0000 0000" class="field" aria-label="Номер карты" @input="fmtNumber">
        <div class="grid grid-cols-2 gap-3">
          <input :value="card.exp" inputmode="numeric" placeholder="ММ/ГГ" class="field" aria-label="Срок действия" @input="fmtExp">
          <input v-model="card.cvc" inputmode="numeric" maxlength="3" placeholder="CVC" type="password" class="field" aria-label="CVC">
        </div>
      </template>
      <div v-else-if="method === 'sbp'" class="flex items-center gap-4 rounded-xl bg-card-2 p-4">
        <TicketQr value="https://qr.nspk.ru/demo-joined" :size="96" />
        <p class="text-sm text-soft">Отсканируйте QR-код в приложении банка или нажмите «Оплатить», чтобы открыть банк на телефоне.</p>
      </div>
      <p v-else class="rounded-xl bg-card-2 p-4 text-sm text-soft">Вы будете перенаправлены в приложение кошелька для подтверждения платежа.</p>

      <button class="btn-primary mt-2 py-3.5" :disabled="!valid || processing" type="submit">
        <AppIcon v-if="processing" name="refresh" :size="16" class="animate-spin" />
        {{ processing ? 'Обрабатываем платёж…' : `Оплатить ${formatPrice(amount)}` }}
      </button>
      <p class="flex items-center justify-center gap-1.5 text-xs text-muted">
        <AppIcon name="lock" :size="14" /> Демо-режим: деньги не списываются
      </p>
    </form>
  </AppModal>
</template>

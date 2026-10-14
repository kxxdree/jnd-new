<script setup lang="ts">
import QRCode from 'qrcode'

const props = withDefaults(defineProps<{ value: string; size?: number }>(), { size: 180 })
const svg = ref('')

watchEffect(async () => {
  svg.value = await QRCode.toString(props.value, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#ffffff' },
  })
})
</script>

<template>
  <div
    class="overflow-hidden rounded-xl bg-white p-2 [&>svg]:h-full [&>svg]:w-full"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    :aria-label="`QR-код билета ${value}`"
    v-html="svg"
  />
</template>

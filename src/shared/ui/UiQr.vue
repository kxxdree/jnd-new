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
    class="overflow-hidden rounded-2xl bg-white p-2 shadow-[0_0_0_6px_rgb(255_255_255/0.12),0_20px_50px_-10px_rgb(255_77_0/0.5)] [&>svg]:h-full [&>svg]:w-full"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    :aria-label="`QR-код ${value}`"
    v-html="svg"
  />
</template>

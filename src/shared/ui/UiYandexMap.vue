<script setup lang="ts">
/** Точка на Яндекс Картах (виджет, без API-ключа, тёмная тема) */
const props = withDefaults(defineProps<{ lat: number; lng: number; title?: string; zoom?: number }>(), { zoom: 16 })

const point = computed(() => `${props.lng},${props.lat}`)
const src = computed(() => `https://yandex.ru/map-widget/v1/?ll=${point.value}&z=${props.zoom}&pt=${point.value},pm2orm&l=map&theme=dark`)
</script>

<template>
  <div class="relative h-full w-full overflow-hidden bg-surface">
    <iframe
      :src="src"
      :title="title ? `${title} на карте` : 'Карта'"
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      class="absolute inset-0 h-full w-full border-0"
    />
  </div>
</template>

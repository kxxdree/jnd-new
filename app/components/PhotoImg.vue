<script setup lang="ts">
/** Фото с фирменной оранжевой дуотон-тонировкой; при ошибке загрузки остаётся градиент */
const props = withDefaults(defineProps<{ src: string; alt?: string; tint?: boolean }>(), { alt: '', tint: true })
const failed = ref(false)
const img = ref<HTMLImageElement>()

// ошибка могла случиться до гидрации, когда @error ещё не был навешан
onMounted(() => {
  if (img.value?.complete && img.value.naturalWidth === 0) failed.value = true
})
watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <div class="relative overflow-hidden bg-linear-to-br from-[#ff5a14] via-[#e23200] to-[#5c1200]">
    <img
      v-if="!failed"
      ref="img"
      :src="src"
      :alt="alt"
      loading="lazy"
      class="absolute inset-0 h-full w-full object-cover text-transparent"
      :class="tint ? 'grayscale contrast-[1.15]' : ''"
      @error="failed = true"
    >
    <template v-if="tint">
      <div class="pointer-events-none absolute inset-0 bg-[#ff5a1f] mix-blend-multiply" />
      <div class="pointer-events-none absolute inset-0 bg-[#3d0800] mix-blend-screen" />
    </template>
    <slot />
  </div>
</template>

<script setup lang="ts">
import background from "../assets/images/page-background.jpg";
</script>

<template>
  <!-- Общий фон сайта; hero на главной перекрывает его своим UiBackdrop -->
  <div class="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-ink [transform:translateZ(0)]" aria-hidden="true">
    <img :src="background" alt="" decoding="async" class="absolute inset-0 h-full w-full object-cover grayscale" />
    <div class="absolute inset-0 bg-black/25" />
  </div>
</template>

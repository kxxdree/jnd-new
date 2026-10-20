<script setup lang="ts">
import background from "../assets/images/background.jpg";

const grain = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 -0.2"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>',
)}")`;
</script>

<template>
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-ink" aria-hidden="true">
    <img :src="background" alt="" fetchpriority="high" decoding="async" class="absolute inset-0 h-full w-full object-cover grayscale" />

    <div class="absolute inset-0 bg-black/25" />
    <div class="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_40%,rgb(5_5_5/0.6)_100%)]" />

    <div class="absolute inset-0 opacity-[0.12] mix-blend-overlay" :style="{ backgroundImage: grain }" />

    <!-- Плавный переход в фон страницы -->
    <div class="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-ink" />
  </div>
</template>

<script setup lang="ts">
import { grain } from "./grain";
</script>

<template>
  <!-- Общий фон сайта: тёплые пятна света по краям (дают стеклу что размывать) + зерно; hero на главной перекрывает его своим UiBackdrop -->
  <div class="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-ink [transform:translateZ(0)]" aria-hidden="true">
    <div class="absolute -top-[20vh] -left-[15vw] size-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgb(255_77_0/0.14),transparent)]" />
    <div class="absolute -right-[20vw] -bottom-[25vh] size-[75vmax] rounded-full bg-[radial-gradient(closest-side,rgb(255_217_140/0.09),transparent)]" />
    <div class="absolute top-1/2 left-2/3 size-[40vmax] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_120_40/0.06),transparent)]" />
    <div class="absolute inset-0 opacity-[0.06] mix-blend-overlay" :style="{ backgroundImage: grain }" />
  </div>
</template>

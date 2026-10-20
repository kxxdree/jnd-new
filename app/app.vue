<script setup lang="ts">
import { UiGlassDefs, UiToaster } from '@shared/ui'
</script>

<template>
  <UiGlassDefs />
  <NuxtLoadingIndicator color="linear-gradient(90deg,#ff4d00,#ffd98c)" :height="2" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UiToaster />
</template>

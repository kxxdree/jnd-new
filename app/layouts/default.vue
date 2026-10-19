<script setup lang="ts">
import { AppFooter } from '@widgets/footer'
import { AppHeader } from '@widgets/header'
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

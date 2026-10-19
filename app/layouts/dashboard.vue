<script setup lang="ts">
import { AppHeader } from '@widgets/header'

/** Лэйаут кабинетов (партнёр, админ): без большого футера */
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="flex-1 pb-16">
      <slot />
    </main>
  </div>
</template>

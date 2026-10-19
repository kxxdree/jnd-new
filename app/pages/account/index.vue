<script setup lang="ts">
import { AccountPage } from '@pages/account'

definePageMeta({ middleware: 'auth' })
</script>

<template>
  <AccountPage />
</template>

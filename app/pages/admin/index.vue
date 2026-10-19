<script setup lang="ts">
import { AdminPage } from '@pages/admin'

definePageMeta({ middleware: 'auth', roles: ['admin'], layout: 'dashboard' })
</script>

<template>
  <AdminPage />
</template>

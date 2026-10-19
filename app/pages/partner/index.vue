<script setup lang="ts">
import { PartnerPage } from '@pages/partner'

definePageMeta({ middleware: 'auth', roles: ['venue', 'artist', 'admin'], layout: 'dashboard' })
</script>

<template>
  <PartnerPage />
</template>

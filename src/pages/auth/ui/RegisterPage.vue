<script setup lang="ts">
import { RegisterForm } from '@features/auth'
import AuthShell from './AuthShell.vue'

useHead({ title: 'Регистрация - Joined' })
</script>

<template>
  <AuthShell title="Присоединяйтесь" subtitle="Зарегистрируйтесь, чтобы следить за любимыми местами и группами">
    <RegisterForm />
    <p class="mt-8 text-center text-sm text-muted">
      Уже есть аккаунт? <NuxtLink to="/login" class="text-white hover:text-sand">Войти</NuxtLink>
    </p>
  </AuthShell>
</template>

<script setup lang="ts">
import type { Role } from '~/data/types'

useHead({ title: 'Вход — Joined' })

const route = useRoute()
const { login } = useAuth()
const form = reactive({ email: '', password: '' })
const error = ref('')

const redirectFor = (role: Role) => {
  if (route.query.redirect) return String(route.query.redirect)
  if (role === 'admin') return '/admin'
  if (role === 'venue' || role === 'artist') return '/partner'
  return '/account'
}

const submit = () => {
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return (error.value = 'Введите корректный email')
  if (form.password.length < 6) return (error.value = 'Пароль — минимум 6 символов')
  // демо: роль угадываем по email
  const role: Role = form.email.startsWith('admin') ? 'admin' : form.email.startsWith('bar') ? 'venue' : form.email.startsWith('band') ? 'artist' : 'user'
  login({ email: form.email, role })
  navigateTo(redirectFor(role))
}

const demo: { role: Role; label: string; email: string; name: string }[] = [
  { role: 'user', label: 'Гость', email: 'alex@joined.ru', name: 'Алекс' },
  { role: 'venue', label: 'Бар', email: 'bar@redvelvet.ru', name: 'Red Velvet' },
  { role: 'artist', label: 'Группа', email: 'band@orangesunset.ru', name: 'Orange Sunset' },
  { role: 'admin', label: 'Админ', email: 'admin@joined.ru', name: 'Админ' },
]
const demoLogin = (d: typeof demo[number]) => {
  login({ email: d.email, name: d.name, role: d.role })
  navigateTo(redirectFor(d.role))
}
</script>

<template>
  <AuthShell title="С возвращением" subtitle="Войдите, чтобы покупать билеты, бронировать столики и следить за любимыми группами.">
    <form class="grid gap-4" novalidate @submit.prevent="submit">
      <label>
        <span class="label">Email</span>
        <input v-model="form.email" type="email" autocomplete="email" class="field" placeholder="sample@gmail.com">
      </label>
      <label>
        <span class="label">Пароль</span>
        <input v-model="form.password" type="password" autocomplete="current-password" class="field" placeholder="••••••••">
      </label>
      <p v-if="error" class="text-sm text-accent-text">{{ error }}</p>
      <button class="btn-primary mt-2 py-3.5" type="submit">Войти</button>
    </form>

    <div class="my-8 flex items-center gap-4 text-xs text-muted">
      <div class="h-px flex-1 bg-line" /> демо-вход <div class="h-px flex-1 bg-line" />
    </div>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button v-for="d in demo" :key="d.role" class="btn-dark" @click="demoLogin(d)">{{ d.label }}</button>
    </div>

    <p class="mt-8 text-center text-sm text-muted">
      Нет аккаунта? <NuxtLink to="/register" class="text-white hover:text-accent-text">Зарегистрироваться</NuxtLink>
    </p>
  </AuthShell>
</template>

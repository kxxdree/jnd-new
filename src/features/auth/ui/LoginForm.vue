<script setup lang="ts">
import { homeForRole, type Role, useSession } from '@entities/session'
import { isEmail } from '@shared/lib'

const route = useRoute()
const { login } = useSession()
const form = reactive({ email: '', password: '' })
const error = ref('')

const go = (role: Role) => navigateTo(route.query.redirect ? String(route.query.redirect) : homeForRole(role))

const submit = () => {
  if (!isEmail(form.email)) return (error.value = 'Введите корректный email')
  if (form.password.length < 6) return (error.value = 'Пароль - минимум 6 символов')
  // демо: роль угадываем по началу email
  const role: Role = form.email.startsWith('admin') ? 'admin' : form.email.startsWith('bar') ? 'venue' : form.email.startsWith('band') ? 'artist' : 'user'
  login({ email: form.email, role })
  go(role)
}

const demo: { role: Role; label: string; email: string; name: string }[] = [
  { role: 'user', label: 'Гость', email: 'alex@joined.ru', name: 'Алекс' },
  { role: 'venue', label: 'Бар', email: 'bar@redvelvet.ru', name: 'Red Velvet' },
  { role: 'artist', label: 'Группа', email: 'band@orangesunset.ru', name: 'Orange Sunset' },
  { role: 'admin', label: 'Админ', email: 'admin@joined.ru', name: 'Админ' },
]
const demoLogin = (d: typeof demo[number]) => {
  login({ email: d.email, name: d.name, role: d.role })
  go(d.role)
}
</script>

<template>
  <div>
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
  </div>
</template>

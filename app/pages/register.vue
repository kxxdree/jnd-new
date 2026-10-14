<script setup lang="ts">
import type { Role } from '~/data/types'

useHead({ title: 'Регистрация — Joined' })

const route = useRoute()
const { login } = useAuth()

const roles: { id: Exclude<Role, 'admin'>; name: string; desc: string; icon: string }[] = [
  { id: 'user', name: 'Слушатель', desc: 'Билеты, брони, избранное', icon: 'user' },
  { id: 'venue', name: 'Заведение', desc: 'Афиша, меню, брони', icon: 'glass' },
  { id: 'artist', name: 'Музыкант', desc: 'Профиль группы, концерты', icon: 'music' },
]

const form = reactive({
  role: (roles.find(r => r.id === route.query.role)?.id ?? 'user') as Exclude<Role, 'admin'>,
  name: '',
  email: '',
  password: '',
  agree: false,
})
const error = ref('')

const nameLabel = computed(() => ({ user: 'Имя', venue: 'Название заведения', artist: 'Название группы' })[form.role])

const submit = () => {
  if (form.name.trim().length < 2) return (error.value = `Укажите поле «${nameLabel.value}»`)
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return (error.value = 'Введите корректный email')
  if (form.password.length < 6) return (error.value = 'Пароль — минимум 6 символов')
  if (!form.agree) return (error.value = 'Нужно согласиться с условиями сервиса')
  login({ email: form.email, name: form.name.trim(), role: form.role })
  navigateTo(form.role === 'user' ? '/account' : '/partner')
}
</script>

<template>
  <AuthShell title="Присоединяйтесь" subtitle="Один аккаунт — для слушателей, заведений и музыкантов.">
    <div class="mb-6 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Тип аккаунта">
      <button
        v-for="r in roles"
        :key="r.id"
        type="button"
        role="radio"
        :aria-checked="form.role === r.id"
        class="flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-colors"
        :class="form.role === r.id ? 'border-accent bg-accent-deep' : 'border-line hover:border-[#3a3a3a]'"
        @click="form.role = r.id"
      >
        <AppIcon :name="r.icon" :class="form.role === r.id ? 'text-accent' : 'text-muted'" />
        <span class="text-sm font-medium">{{ r.name }}</span>
        <span class="hidden text-xs text-muted sm:block">{{ r.desc }}</span>
      </button>
    </div>

    <form class="grid gap-4" novalidate @submit.prevent="submit">
      <label>
        <span class="label">{{ nameLabel }}</span>
        <input v-model="form.name" class="field" autocomplete="name">
      </label>
      <label>
        <span class="label">Email</span>
        <input v-model="form.email" type="email" autocomplete="email" class="field" placeholder="sample@gmail.com">
      </label>
      <label>
        <span class="label">Пароль</span>
        <input v-model="form.password" type="password" autocomplete="new-password" class="field" placeholder="Минимум 6 символов">
      </label>
      <label class="flex items-start gap-3 text-sm text-soft">
        <input v-model="form.agree" type="checkbox" class="mt-0.5 size-4 accent-[#ff4d00]">
        <span>Принимаю <NuxtLink to="/rules" class="text-white underline-offset-2 hover:underline">условия сервиса</NuxtLink> и политику конфиденциальности</span>
      </label>
      <p v-if="form.role !== 'user'" class="rounded-xl bg-card p-3 text-xs text-muted">
        Профиль {{ form.role === 'venue' ? 'заведения' : 'группы' }} появится в каталоге после модерации — обычно это занимает до 24 часов.
      </p>
      <p v-if="error" class="text-sm text-accent-text">{{ error }}</p>
      <button class="btn-primary mt-2 py-3.5" type="submit">Создать аккаунт</button>
    </form>

    <p class="mt-8 text-center text-sm text-muted">
      Уже есть аккаунт? <NuxtLink to="/login" class="text-white hover:text-accent-text">Войти</NuxtLink>
    </p>
  </AuthShell>
</template>

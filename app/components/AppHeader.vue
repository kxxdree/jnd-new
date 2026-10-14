<script setup lang="ts">
const { user, logout } = useAuth()
const route = useRoute()
const open = ref(false)

const links = [
  { to: '/', label: 'Главная' },
  { to: '/venues', label: 'Бары' },
  { to: '/events', label: 'Афиша' },
  { to: '/artists', label: 'Артисты' },
]

const cabinet = computed(() => {
  if (!user.value) return null
  if (user.value.role === 'admin') return { to: '/admin', label: 'Админ-панель' }
  if (user.value.role === 'venue' || user.value.role === 'artist') return { to: '/partner', label: 'Кабинет партнёра' }
  return null
})

const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

watch(() => route.fullPath, () => { open.value = false })
watch(open, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-xl">
    <div class="container-x flex h-[72px] items-center justify-between gap-6">
      <AppLogo />

      <nav class="hidden items-center gap-8 md:flex" aria-label="Основная навигация">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="text-sm transition-colors hover:text-white"
          :class="isActive(l.to) ? 'text-white' : 'text-soft'"
        >
          {{ l.label }}
        </NuxtLink>
      </nav>

      <div class="hidden items-center gap-2 md:flex">
        <template v-if="user">
          <NuxtLink v-if="cabinet" :to="cabinet.to" class="btn-ghost">{{ cabinet.label }}</NuxtLink>
          <NuxtLink to="/account" class="btn-dark">
            <span class="grid size-6 place-items-center rounded-full bg-accent text-xs font-semibold uppercase">{{ user.name[0] }}</span>
            {{ user.name }}
          </NuxtLink>
        </template>
        <NuxtLink v-else to="/login" class="btn-dark">Войти</NuxtLink>
      </div>

      <button class="grid size-10 place-items-center md:hidden" :aria-expanded="open" aria-label="Меню" @click="open = !open">
        <AppIcon :name="open ? 'x' : 'menu'" :size="26" />
      </button>
    </div>

    <!-- Мобильное меню -->
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="open" class="fixed inset-x-0 top-18 bottom-0 overflow-y-auto bg-ink md:hidden">
        <nav class="container-x flex flex-col py-6">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="flex items-center justify-between border-b border-line py-5 text-3xl font-medium tracking-tight"
            :class="isActive(l.to) ? 'text-accent' : 'text-white'"
          >
            {{ l.label }}
            <AppIcon name="arrow-up-right" :size="24" />
          </NuxtLink>
          <NuxtLink v-if="cabinet" :to="cabinet.to" class="flex items-center justify-between border-b border-line py-5 text-3xl font-medium tracking-tight">
            {{ cabinet.label }}
            <AppIcon name="arrow-up-right" :size="24" />
          </NuxtLink>

          <div class="mt-8 flex flex-col gap-3">
            <template v-if="user">
              <NuxtLink to="/account" class="btn-primary py-3.5">Личный кабинет</NuxtLink>
              <button class="btn-dark py-3.5" @click="logout()">Выйти</button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="btn-primary py-3.5">Войти</NuxtLink>
              <NuxtLink to="/register" class="btn-dark py-3.5">Регистрация</NuxtLink>
            </template>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

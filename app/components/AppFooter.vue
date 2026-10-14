<script setup lang="ts">
const { push } = useToast()
const email = ref('')

const submit = () => {
  if (!/^\S+@\S+\.\S+$/.test(email.value)) return push('Введите корректный email')
  push('Готово! Подборки будут приходить по пятницам')
  email.value = ''
}

const quick = [
  { to: '/', label: 'Главная' },
  { to: '/venues', label: 'Бары' },
  { to: '/events', label: 'Афиша' },
  { to: '/artists', label: 'Артисты' },
]
const partners = [
  { to: '/register?role=venue', label: 'Для заведений' },
  { to: '/register?role=artist', label: 'Для музыкантов' },
  { to: '/rules', label: 'Условия сервиса' },
  { to: '/rules#privacy', label: 'Конфиденциальность' },
]
</script>

<template>
  <footer class="relative mt-24 overflow-hidden bg-[linear-gradient(180deg,#000_0%,#000_12%,#3a1000_38%,#d63a00_68%,#ff6a1a_84%,#ffcf7a_100%)]">
    <div class="container-x relative z-10">
      <!-- Разделитель со звёздочкой -->
      <div class="flex items-center gap-6 pt-4" aria-hidden="true">
        <div class="h-px flex-1 bg-line" />
        <AppIcon name="sparkle" :size="22" class="text-[#555]" />
        <div class="h-px flex-1 bg-line" />
      </div>

      <div class="grid grid-cols-2 gap-x-6 gap-y-10 pt-16 md:grid-cols-[auto_auto_auto_1fr] md:gap-x-16">
        <div>
          <h3 class="mb-5 text-white/50">Навигация</h3>
          <ul class="space-y-3 text-sm">
            <li v-for="l in quick" :key="l.label"><NuxtLink :to="l.to" class="hover:text-sand">{{ l.label }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="mb-5 text-white/50">Партнёрам</h3>
          <ul class="space-y-3 text-sm">
            <li v-for="l in partners" :key="l.label"><NuxtLink :to="l.to" class="hover:text-sand">{{ l.label }}</NuxtLink></li>
          </ul>
        </div>
        <div class="col-span-2 md:col-span-1">
          <h3 class="mb-5 text-white/50">Мы в соцсетях</h3>
          <div class="flex items-center gap-4">
            <a href="#" aria-label="Telegram" class="hover:text-sand"><AppIcon name="telegram" /></a>
            <a href="#" aria-label="Instagram" class="hover:text-sand"><AppIcon name="instagram" /></a>
            <a href="#" aria-label="VK" class="hover:text-sand"><AppIcon name="vk" /></a>
          </div>
        </div>
        <div class="col-span-2 md:col-span-1 md:justify-self-end md:max-w-sm">
          <h3 class="mb-5 text-white/50">Рассылка</h3>
          <p class="mb-6 text-xl leading-snug font-medium">Раз уж вы дочитали до конца — подпишитесь на афишу недели.</p>
          <form class="flex gap-2" @submit.prevent="submit">
            <input v-model="email" type="email" placeholder="sample@gmail.com" aria-label="Email" class="field flex-1 bg-white/10 backdrop-blur">
            <button class="btn-primary shrink-0 bg-white/15 hover:bg-white/25" type="submit">Подписаться</button>
          </form>
        </div>
      </div>

      <div class="mt-16 flex flex-wrap justify-between gap-2 text-xs text-white/70">
        <span>© {{ new Date().getFullYear() }} Joined. Бары и живая музыка.</span>
        <span>18+</span>
      </div>
    </div>

    <!-- Гигантский вордмарк -->
    <div
      class="pointer-events-none relative -mb-[0.2em] mt-4 select-none text-center text-[30vw] leading-[0.8] font-semibold tracking-[-0.06em] lg:text-[23rem]"
      aria-hidden="true"
    >
      <span class="bg-linear-to-b from-[#ff9a4d]/70 to-[#ffe2a6] bg-clip-text text-transparent">Joined</span>
    </div>
  </footer>
</template>

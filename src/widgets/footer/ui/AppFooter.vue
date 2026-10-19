<script setup lang="ts">
import { NewsletterForm } from '@features/newsletter'
import { UiIcon, UiLogo } from '@shared/ui'

const nav = [
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
const socials = [
  { icon: 'telegram', label: 'Telegram' },
  { icon: 'instagram', label: 'Instagram' },
  { icon: 'vk', label: 'VK' },
]
</script>

<template>
  <footer class="relative mt-32 overflow-hidden px-3 pb-3 sm:px-6 sm:pb-6">
    <div class="glass mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] [--lg-tint:rgb(16_16_18/0.48)]">
      <div class="grid gap-10 p-6 sm:p-10 md:grid-cols-[1.2fr_auto_auto_1.3fr] md:gap-14 lg:p-14">
        <div>
          <UiLogo />
          <p class="mt-4 max-w-xs text-sm text-soft">Бары, сцены и живая музыка в одном месте. Находите свой звук каждый вечер.</p>
          <div class="mt-6 flex items-center gap-2">
            <a v-for="s in socials" :key="s.icon" href="#" :aria-label="s.label" class="btn-icon size-10"><UiIcon :name="s.icon" :size="18" /></a>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-10 md:contents">
          <div>
            <h3 class="mb-5 text-sm text-white/50">Навигация</h3>
            <ul class="space-y-3 text-sm">
              <li v-for="l in nav" :key="l.label"><NuxtLink :to="l.to" class="transition-colors hover:text-sand">{{ l.label }}</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="mb-5 text-sm text-white/50">Партнёрам</h3>
            <ul class="space-y-3 text-sm">
              <li v-for="l in partners" :key="l.label"><NuxtLink :to="l.to" class="transition-colors hover:text-sand">{{ l.label }}</NuxtLink></li>
            </ul>
          </div>
        </div>
        <div>
          <h3 class="mb-5 text-sm text-white/50">Рассылка</h3>
          <p class="mb-5 text-xl leading-snug font-medium">Раз уж вы дочитали до конца - подпишитесь на афишу недели.</p>
          <NewsletterForm />
        </div>
      </div>

      <!-- Гигантский стеклянный вордмарк -->
      <div class="pointer-events-none relative -mt-4 select-none overflow-hidden text-center" aria-hidden="true">
        <span class="text-liquid block translate-y-[18%] text-[27vw] leading-[0.8] font-semibold tracking-[-0.07em] opacity-90 lg:text-[21rem]">Joined</span>
      </div>

      <div class="relative flex flex-wrap justify-between gap-2 border-t border-line px-6 py-5 text-xs text-white/60 sm:px-10 lg:px-14">
        <span>© {{ new Date().getFullYear() }} Joined. Бары и живая музыка.</span>
        <span>18+</span>
      </div>
    </div>
  </footer>
</template>

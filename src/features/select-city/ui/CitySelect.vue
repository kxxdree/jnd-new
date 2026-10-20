<script setup lang="ts">
import { useCurrentCity } from '@entities/city'
import { useToast } from '@shared/lib'
import { UiIcon } from '@shared/ui'

const { cityId, city, cities, detect, locating } = useCurrentCity()
const { push } = useToast()
const open = ref(false)
const root = ref<HTMLElement>()

const onDetect = async () => {
  const id = await detect()
  open.value = false
  push(id ? `Ваш город: ${city.value.name}` : 'Не удалось определить геолокацию')
}

const onDoc = (e: MouseEvent) => {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('click', onDoc))
onBeforeUnmount(() => document.removeEventListener('click', onDoc))
</script>

<template>
  <div ref="root" class="relative">
    <button type="button" class="pill" :aria-expanded="open" @click="open = !open">
      <UiIcon name="pin" :size="16" class="text-accent-text" />
      {{ city.name }}
      <UiIcon name="chevron-down" :size="16" class="text-muted transition-transform duration-300" :class="{ 'rotate-180': open }" />
    </button>
    <Transition
      enter-active-class="transition duration-300 ease-[var(--ease-liquid)]"
      enter-from-class="opacity-0 -translate-y-2 scale-95"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="open" class="absolute top-full left-1/2 z-40 mt-2 w-64 origin-top -translate-x-1/2 rounded-xl bg-[#1c1c1e] p-1 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.8)] sm:left-0 sm:translate-x-0">
        <button type="button" class="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-accent-text hover:bg-white/10" @click="onDetect">
          <UiIcon name="locate" :size="16" />
          {{ locating ? 'Определяем…' : 'Определить автоматически' }}
        </button>
        <div class="mx-3 my-1 h-px bg-line" />
        <button
          v-for="c in cities"
          :key="c.id"
          type="button"
          class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-white/10"
          @click="cityId = c.id; open = false"
        >
          {{ c.name }}
          <UiIcon v-if="c.id === cityId" name="check" :size="16" class="text-accent-text" />
        </button>
      </div>
    </Transition>
  </div>
</template>

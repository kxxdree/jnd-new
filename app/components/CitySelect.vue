<script setup lang="ts">
const { cityId, city, cities, detect, locating } = useCity()
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
    <button type="button" class="pill gap-2" :aria-expanded="open" @click="open = !open">
      <AppIcon name="pin" :size="16" class="text-accent" />
      {{ city.name }}
      <AppIcon name="chevron-down" :size="16" class="text-muted transition-transform" :class="{ 'rotate-180': open }" />
    </button>
    <Transition
      enter-active-class="transition duration-150"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="absolute top-full left-0 z-40 mt-2 w-64 rounded-2xl border border-line bg-card p-2 shadow-2xl">
        <button type="button" class="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-accent-text hover:bg-card-2" @click="onDetect">
          <AppIcon name="locate" :size="16" />
          {{ locating ? 'Определяем…' : 'Определить автоматически' }}
        </button>
        <div class="my-1 h-px bg-line" />
        <button
          v-for="c in cities"
          :key="c.id"
          type="button"
          class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-card-2"
          @click="cityId = c.id; open = false"
        >
          {{ c.name }}
          <AppIcon v-if="c.id === cityId" name="check" :size="16" class="text-accent" />
        </button>
      </div>
    </Transition>
  </div>
</template>

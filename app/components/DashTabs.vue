<script setup lang="ts" generic="T extends string">
/** Вкладки кабинета: вертикальное меню на десктопе, горизонтальная лента на мобильных */
defineProps<{ tabs: { id: T; name: string; icon: string; badge?: number }[] }>()
const model = defineModel<T>({ required: true })
</script>

<template>
  <nav class="scroll-x -mx-4 px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0" aria-label="Разделы">
    <button
      v-for="t in tabs"
      :key="t.id"
      class="flex shrink-0 items-center gap-3 rounded-full px-4 py-2 text-sm transition-colors lg:rounded-xl lg:py-3"
      :class="model === t.id ? 'bg-accent text-white' : 'bg-card-2 text-soft hover:text-white lg:bg-transparent lg:hover:bg-card'"
      @click="model = t.id"
    >
      <AppIcon :name="t.icon" :size="18" class="hidden lg:block" />
      {{ t.name }}
      <span
        v-if="t.badge"
        class="ml-auto grid min-w-5 place-items-center rounded-full px-1.5 text-xs"
        :class="model === t.id ? 'bg-white text-black' : 'bg-accent text-white'"
      >{{ t.badge }}</span>
    </button>
  </nav>
</template>

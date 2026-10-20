<script setup lang="ts" generic="T extends string">
import UiIcon from './UiIcon.vue'

/** Стеклянный выпадающий список вместо нативного select. Пустая строка = allLabel */
const props = withDefaults(
  defineProps<{ options: readonly { id: T; name: string }[]; allLabel?: string; icon?: string; label?: string }>(),
  { allLabel: 'Все', icon: undefined, label: undefined },
)
const model = defineModel<T | ''>({ required: true })

const open = ref(false)
const root = ref<HTMLElement>()
const current = computed(() => props.options.find(o => o.id === model.value)?.name ?? props.allLabel)
const items = computed(() => [{ id: '' as T | '', name: props.allLabel }, ...props.options])

const pick = (id: T | '') => {
  model.value = id
  open.value = false
}

const onDoc = (e: MouseEvent) => {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('click', onDoc))
onBeforeUnmount(() => document.removeEventListener('click', onDoc))
</script>

<template>
  <div ref="root" class="relative" @keydown.esc="open = false">
    <button type="button" class="pill w-full justify-between gap-2" :aria-expanded="open" aria-haspopup="listbox" :aria-label="label" @click="open = !open">
      <span class="flex min-w-0 items-center gap-2">
        <UiIcon v-if="icon" :name="icon" :size="16" class="shrink-0 text-accent-text" />
        <span class="truncate">{{ current }}</span>
      </span>
      <UiIcon name="chevron-down" :size="16" class="shrink-0 text-muted transition-transform duration-300" :class="{ 'rotate-180': open }" />
    </button>
    <Transition
      enter-active-class="transition duration-300 ease-[var(--ease-liquid)]"
      enter-from-class="opacity-0 -translate-y-2 scale-95"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="open" role="listbox" class="glass-strong absolute top-full right-0 left-0 z-40 mt-2 origin-top rounded-3xl p-2 [--lg-tint:#121214] sm:left-auto sm:w-64">
        <button
          v-for="o in items"
          :key="o.id"
          type="button"
          role="option"
          :aria-selected="o.id === model"
          class="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm hover:bg-white/10"
          @click="pick(o.id)"
        >
          {{ o.name }}
          <UiIcon v-if="o.id === model" name="check" :size="16" class="text-accent-text" />
        </button>
      </div>
    </Transition>
  </div>
</template>
